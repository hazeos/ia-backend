import {
  IsAlpha,
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';

// TODO локализация сообщений об ошибках валидации
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  header: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @Matches('[a-zA-Z-]+')
  @IsString()
  link: string;

  @IsOptional()
  files: string[];

  createdBy: User;
  updatedBy: User;
}
