import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { IUsersService } from './interfaces/users-service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterQuery, Types } from 'mongoose';
import { UsersRepositoryToken } from '../domain/di.tokens';
import { IUsersRepository } from './interfaces/users-repository.interface';
import { hash } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

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
    return await this.usersRepository.findOne(filter);
  }

  async findOneById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Incorrect ID');
    }
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Incorrect ID');
    }
    return await this.usersRepository.update(id, updateDto);
  }

  async remove(id: string): Promise<User> {
    return await this.usersRepository.remove(id);
  }
}
