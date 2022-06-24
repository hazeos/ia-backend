import { Match } from '../../decorators/match.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { IsEmailAlreadyExist } from '../../decorators/unique-email.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  middleName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmailAlreadyExist(CreateUserDto, (s) => s.email)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Match(CreateUserDto, (s) => s.password, {
    message: 'Passwords are not equal',
  })
  repeatPassword: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  createdBy: User;
  updatedBy: User;
}
