import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { RequiredPermissions } from '../shared/decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { MongooseClassSerializerInterceptor } from '../shared/interceptors/mongoose-class-serializer.interceptor';
import { UsersServiceToken } from '../shared/di.tokens';
import { IUsersService } from './interfaces/users-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoExceptionFilter } from '../shared/exceptions/mongo-exception.filter';
import { UserExistsExceptionFilter } from './exceptions/user-exists.filter';
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { UserExistsValidationPipe } from './pipes/user-exists.pipe';
import { NotFoundExceptionFilter } from '../shared/exceptions/not-found-exception.filter';
import { ObjectIdValidationPipe } from '../shared/pipes/object-id-validation.pipe';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(MongooseClassSerializerInterceptor(User))
@UseFilters(MongoExceptionFilter)
export class UsersController {
  constructor(
    @Inject(UsersServiceToken)
    private readonly usersService: IUsersService<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
  ) {}

  @Post()
  @RequiredPermissions(permissions.users.create)
  @UsePipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  )
  @UseFilters(
    UserExistsExceptionFilter,
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  )
  async create(
    @Body('', UserExistsValidationPipe) createUserDto: CreateUserDto,
    @Req() req,
  ): Promise<User> {
    return await this.usersService.create({
      ...createUserDto,
      createdBy: req.user,
      updatedBy: req.user,
    } as CreateUserDto);
  }

  @Get()
  @RequiredPermissions(permissions.users.read)
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @RequiredPermissions(permissions.users.read)
  @UseFilters(NotFoundExceptionFilter)
  async findOneById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  @RequiredPermissions(permissions.users.update)
  @UsePipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  )
  @UseFilters(
    UserExistsExceptionFilter,
    NotFoundExceptionFilter,
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  )
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body('', UserExistsValidationPipe) updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    return await this.usersService.update(id, {
      ...updateUserDto,
      updatedBy: req.user,
    } as UpdateUserDto);
  }

  @Delete(':id')
  @RequiredPermissions(permissions.users.delete)
  @UseFilters(NotFoundExceptionFilter)
  async remove(@Param('id', ObjectIdValidationPipe) id: string): Promise<User> {
    return await this.usersService.remove(id);
  }
}
