import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Match } from '../../validators/match.decorator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { User } from '../entities/user.entity';

// TODO локализация сообщений об ошибках валидации
export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  middleName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @Match(UpdateUserDto, (s) => s.password, {
    message: i18nValidationMessage('validation.PASSWORDS_DO_NOT_MATCH'),
  })
  repeatPassword: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  role: string;

  updatedBy: User;
}
