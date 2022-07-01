import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUsersService } from './interfaces/users-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterQuery } from 'mongoose';
import { UsersRepositoryToken } from '../shared/di.tokens';
import { IUsersRepository } from './interfaces/users-repository.interface';
import { hash } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { NotFoundExceptionType } from '../shared/exceptions/exceptions.types';

@Injectable()
export class UsersService
  implements IUsersService<User, CreateUserDto, UpdateUserDto>
{
  constructor(
    @Inject(UsersRepositoryToken)
    private readonly usersRepository: IUsersRepository<
      User,
      CreateUserDto,
      UpdateUserDto
    >,
    private readonly configService: ConfigService,
  ) {}

  async create(createDto: CreateUserDto): Promise<User> {
    createDto.password = await hash(
      createDto.password,
      +this.configService.get<number>('SALT_LENGTH'),
    );
    return await this.usersRepository.create(createDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    const user = await this.usersRepository.findOne(filter);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.USERS.USER_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionType);
    }
    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.USERS.USER_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionType);
    }
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    if (updateDto.password) {
      updateDto.password = await hash(
        updateDto.password,
        +this.configService.get<number>('SALT_LENGTH'),
      );
    }
    const user = await this.usersRepository.update(id, updateDto);
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.USERS.USER_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionType);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    return await this.usersRepository.remove(id);
  }
}
