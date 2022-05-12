import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

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
