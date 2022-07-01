import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Match } from '../../validators/match.decorator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { User } from '../entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.FIRST_NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.FIRST_NAME_IS_STRING'),
  })
  firstName: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.LAST_NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.LAST_NAME_IS_STRING'),
  })
  lastName: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.MIDDLE_NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.MIDDLE_NAME_IS_STRING'),
  })
  middleName: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.EMAIL_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.EMAIL_IS_STRING'),
  })
  @IsEmail({
    message: i18nValidationMessage('validation.USERS.EMAIL_IS_EMAIL'),
  })
  email: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.PASSWORD_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.PASSWORD_IS_STRING'),
  })
  password: string;

  @IsOptional()
  @Match(UpdateUserDto, (s) => s.password, {
    message: i18nValidationMessage('validation.PASSWORDS_DO_NOT_MATCH'),
  })
  repeatPassword: string;

  @IsOptional()
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.ROLE_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.ROLE_IS_STRING'),
  })
  role: string;

  updatedBy: User;
}
