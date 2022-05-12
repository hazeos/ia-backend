import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../schemas/role.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | boolean> {
    const user = await this.usersService.findOneByEmail(email);
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
