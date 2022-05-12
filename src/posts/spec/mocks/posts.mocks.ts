import { User } from '../../../users/entities/user.entity';
import { CreatePostDto } from '../../dto/create-post.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { File } from '../../../files/entities/file.entity';
import { Post } from '../../entities/post.entity';

export const mockCreatePostDto = (
  header = 'Test',
  text = 'Test',
  files = [''],
  createdBy = new User(),
  updatedBy = new User(),
): CreatePostDto => ({
  header,
  text,
  files,
  createdBy,
  updatedBy,
});

export const mockUpdatePostDto = (
  header = 'Test',
  text = 'Test',
  files = ['123'],
): UpdatePostDto => ({
  header,
  text,
  files,
});

export const mockPost = (
  _id = '1',
  header = 'Test',
  text = 'Test',
  files = [new File()],
  createdBy = new User(),
  updatedBy = new User(),
): Post => ({
  _id,
  header,
  text,
  files,
  createdBy,
  updatedBy,
});
