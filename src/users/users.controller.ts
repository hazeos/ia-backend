import {
  Controller,
  Get,
  Inject,
  Param,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { RequiredPermissions } from '../decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class-serializer.interceptor';
import { IUsersServiceToken } from '../domain/di.tokens';
import { IUsersService } from './interfaces/users-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MongoExceptionFilter } from '../domain/exceptions/mongo-exception.filter';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(IUsersServiceToken)
    private readonly usersService: IUsersService<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
  ) {}

  @Get(':id')
  @RequiredPermissions(permissions.users.read)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  @UseFilters(MongoExceptionFilter)
  async findOneById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }
}
