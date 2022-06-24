import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUsersService } from './interfaces/users-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterQuery } from 'mongoose';
import { UsersRepositoryToken } from '../domain/di.tokens';
import { IUsersRepository } from './interfaces/users-repository.interface';

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
  ) {}

  async create(createDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.create(createDto);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return await this.usersRepository.findOne(filter);
  }

  async findOneById(id: string): Promise<User> {
    return await this.usersRepository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email: email });
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    return Promise.resolve(undefined);
  }

  async remove(id: string): Promise<User> {
    return Promise.resolve(undefined);
  }
}
