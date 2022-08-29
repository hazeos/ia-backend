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
    return await this.fileModel
      .find()
      .populate({ path: 'createdBy updatedBy' })
      .exec();
  }

  async findOne(): Promise<File> {
    return await this.fileModel
      .findOne()
      .populate({ path: 'createdBy updatedBy' })
      .exec();
  }

  async findOneById(id: string): Promise<File> {
    return await this.fileModel
      .findById(id)
      .populate({ path: 'createdBy updatedBy' })
      .exec();
  }

  async update(id: string, updateDto: UpdateFileDto): Promise<File> {
    return await this.fileModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('createdBy updatedBy')
      .exec();
  }

  async remove(id: string): Promise<File> {
    return await this.fileModel.findByIdAndDelete(id).exec();
  }
}
