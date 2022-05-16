import { Match } from '../../decorators/match.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

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
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Match(CreateUserDto, (s) => s.password)
  repeatPassword: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
