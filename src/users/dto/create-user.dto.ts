import { Match } from '../../validators/match.decorator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.FIRST_NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.FIRST_NAME_IS_STRING'),
  })
  firstName: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.LAST_NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.LAST_NAME_IS_STRING'),
  })
  lastName: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.MIDDLE_NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.MIDDLE_NAME_IS_STRING'),
  })
  middleName: string;

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

  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.PASSWORD_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.PASSWORD_IS_STRING'),
  })
  password: string;

  @Match(CreateUserDto, (s) => s.password, {
    message: i18nValidationMessage('validation.USERS.PASSWORDS_DO_NOT_MATCH'),
  })
  repeatPassword: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.USERS.ROLE_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.USERS.ROLE_IS_STRING'),
  })
  role: string;

  createdBy: User;
  updatedBy: User;
}
