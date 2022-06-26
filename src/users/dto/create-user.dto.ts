import { Match } from '../../validators/match.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

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

  @Match(CreateUserDto, (s) => s.password, {
    message: i18nValidationMessage('errors.PASSWORDS_NOT_EQUAL'),
  })
  repeatPassword: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  createdBy: User;
  updatedBy: User;
}
