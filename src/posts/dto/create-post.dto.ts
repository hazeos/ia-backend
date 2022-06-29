import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

// TODO локализация сообщений об ошибках валидации
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  header: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  files: string[];

  createdBy: User;
  updatedBy: User;
}
