import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare, hash } from 'bcryptjs';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const match = await compare(password, user.password);
      if (match) {
        return user;
      }
    } else {
      return null;
    }
  }

  async login(user: User): Promise<object> {
    const payload = { email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
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
