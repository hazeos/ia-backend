import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../entities/user.entity';
import { UsersServiceToken } from '../../domain/di.tokens';
import { IUsersService } from '../interfaces/users-service.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserExistsException } from '../exceptions/user-exists.exception';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UsersServiceToken)
    private readonly usersService: IUsersService<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.usersService.findOne({ email: request.body.email });
    if (user) {
      throw new UserExistsException();
    }
    return !user;
  }
}
