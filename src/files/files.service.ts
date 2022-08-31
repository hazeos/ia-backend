import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { IFilesService } from './interfaces/files-service.interface';
import { FilesRepositoryToken } from '../shared/di.tokens';
import { IFilesRepository } from './interfaces/files-repository.interface';
import { FilterQuery } from 'mongoose';
import { NotFoundExceptionBodyType } from '../shared/exceptions/exceptions.types';

@Injectable()
export class FilesService
  implements IFilesService<File, CreateFileDto, UpdateFileDto>
{
  constructor(
    @Inject(FilesRepositoryToken)
    private readonly filesRepository: IFilesRepository<
      File,
      CreateFileDto,
      UpdateFileDto
    >,
  ) {}

  async create(createDto: CreateFileDto): Promise<File> {
    return await this.filesRepository.create(createDto);
  }

  async findAll(): Promise<File[]> {
    return await this.filesRepository.findAll();
  }

  async findOne(filter: FilterQuery<File>): Promise<File> {
    const file = await this.filesRepository.findOne(filter);
    if (!file) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.FILES.POST_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionBodyType);
    }
    return file;
  }

  async findOneById(id: string): Promise<File> {
    const file = await this.filesRepository.findOneById(id);
    if (!file) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.FILES.POST_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionBodyType);
    }
    return file;
  }

  async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
    const file = await this.filesRepository.update(id, updateFileDto);
    if (!file) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.FILES.POST_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionBodyType);
    }
    return file;
  }

  async remove(id: string): Promise<File> {
    return await this.filesRepository.remove(id);
  }
}
