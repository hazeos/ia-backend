import { CreateFileDto } from '../../dto/create-file.dto';
import { User } from '../../../users/entities/user.entity';
import { File } from '../../entities/file.entity';
import { UpdateFileDto } from '../../dto/update-file.dto';

export const mockCreateFileDto = (
  name: string,
  path: string,
  createdBy = new User(),
  updatedBy = new User(),
): CreateFileDto => ({
  name,
  path,
  createdBy,
  updatedBy,
});

export const mockUpdateFileDto = (
  name: string,
  path: string,
  updatedBy = new User(),
): UpdateFileDto => ({
  name,
  path,
  updatedBy,
});

export const mockFile = (
  _id = '1',
  name = 'test',
  path = './uploads',
  createdBy = new User(),
  updatedBy = new User(),
): File => ({ _id, name, path, createdBy, updatedBy });
