import { CreateUserDto } from './create-user.dto';
import { PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Match } from '../../validators/match.decorator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'firstName',
  'lastName',
  'middleName',
] as const) {
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @Match(UpdateUserDto, (s) => s.password, {
    message: i18nValidationMessage('errors.PASSWORDS_NOT_EQUAL'),
  })
  repeatPassword: string;

  @IsOptional()
  role: string;
}
