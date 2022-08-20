import { IFilesRepository } from './interfaces/files-repository.interface';
import { File, FileDocument } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class FilesRepository
  implements IFilesRepository<File, CreateFileDto, UpdateFileDto>
{
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async create(createDto: CreateFileDto): Promise<File> {
    return (await this.fileModel.create(createDto)).populate({
      path: 'createdBy updatedBy',
    });
  }

  async findAll(): Promise<File[]> {
    return Promise.resolve([]);
  }

  async findOne(): Promise<File> {
    return Promise.resolve(undefined);
  }

  async findOneById(id: string): Promise<File> {
    return Promise.resolve(undefined);
  }

  async remove(id: string): Promise<File> {
    return Promise.resolve(undefined);
  }

  async update(id: string, updateDto: UpdateFileDto): Promise<File> {
    return Promise.resolve(undefined);
  }
}
