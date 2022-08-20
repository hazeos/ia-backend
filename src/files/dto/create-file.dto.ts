import { User } from '../../users/entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateFileDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.FILES.NAME_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.FILES.NAME_IS_STRING'),
  })
  name: string;

  path: string;

  createdBy: User;
  updatedBy: User;
}
