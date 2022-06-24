import { Inject, Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../schemas/role.schema';
import { UsersServiceToken } from '../domain/di.tokens';
import { IUsersService } from '../users/interfaces/users-service.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersServiceToken)
    private readonly usersService: IUsersService<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | boolean> {
    const user = await this.usersService.findOne({ email: email });
    if (user) {
      const match = await compare(password, user.password);
      if (match) {
        return user;
      }
    }
    return false;
  }

  async login(user: User): Promise<{
    accessToken: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    role: Role;
  }> {
    return {
      accessToken: this.jwtService.sign({ email: user.email }),
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      role: user.role,
    };
  }

  async hash(value: string): Promise<string> {
    console.log(await compare('password', await hash(value, 12)));
    return await hash(value, 12);
  }
}
