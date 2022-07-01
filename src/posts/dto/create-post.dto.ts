import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePostDto {
  @IsNotEmpty({
    message: i18nValidationMessage('validation.POSTS.HEADER_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.POSTS.HEADER_IS_STRING'),
  })
  header: string;

  @IsNotEmpty({
    message: i18nValidationMessage('validation.POSTS.TEXT_IS_NOT_EMPTY'),
  })
  @IsString({
    message: i18nValidationMessage('validation.POSTS.TEXT_IS_STRING'),
  })
  text: string;

  @Matches(/^[a-zA-Z\d-]+$/, {
    message: i18nValidationMessage('validation.POSTS.LINK_MATCHES'),
  })
  link: string;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.POSTS.FILES_IS_STRING'),
    each: true,
  })
  files: string[];

  createdBy: User;
  updatedBy: User;
}
