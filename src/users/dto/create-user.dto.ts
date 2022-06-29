import { Match } from '../../validators/match.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

// TODO локализация сообщений об ошибках валидации
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
    message: i18nValidationMessage('validation.PASSWORDS_DO_NOT_MATCH'),
  })
  repeatPassword: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  createdBy: User;
  updatedBy: User;
}
