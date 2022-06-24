import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @UseFilters(MongoExceptionFilter)
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
}
