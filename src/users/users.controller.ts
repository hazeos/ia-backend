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
import { RequiredPermissions } from '../decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class-serializer.interceptor';
import { UsersServiceToken } from '../domain/di.tokens';
import { IUsersService } from './interfaces/users-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoExceptionFilter } from '../domain/exceptions/mongo-exception.filter';
import { UserExistsGuard } from './guards/user-exists.guard';
import { UserExistsExceptionFilter } from './exceptions/user-exists.exception';
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

@Controller('users')
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
  @UseGuards(JwtAuthGuard, PermissionsGuard, UserExistsGuard)
  @UsePipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  )
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @UseFilters(
    UserExistsExceptionFilter,
    MongoExceptionFilter,
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @UseFilters(MongoExceptionFilter)
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @RequiredPermissions(permissions.users.read)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @UseFilters(MongoExceptionFilter)
  async findOneById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  @RequiredPermissions(permissions.users.update)
  @UseGuards(JwtAuthGuard, PermissionsGuard, UserExistsGuard)
  @UsePipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  )
  @UseFilters(
    UserExistsExceptionFilter,
    MongoExceptionFilter,
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    return await this.usersService.update(id, {
      ...updateUserDto,
      updatedBy: req.user,
    } as UpdateUserDto);
  }

  @Delete(':id')
  @RequiredPermissions(permissions.users.delete)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseFilters(MongoExceptionFilter)
  async remove(@Param('id') id: string): Promise<User> {
    return await this.usersService.remove(id);
  }
}
