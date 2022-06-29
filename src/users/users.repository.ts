import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { IUsersRepository } from './interfaces/users-repository.interface';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { NotFoundExceptionType } from '../shared/exceptions/exceptions.types';

export class UsersRepository
  implements IUsersRepository<User, CreateUserDto, UpdateUserDto>
{
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createDto: CreateUserDto): Promise<User> {
    return (await this.userModel.create(createDto)).populate({
      path: 'role createdBy updatedBy',
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel
      .find()
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      })
      .exec();
  }

  async findOne(filter: FilterQuery<User>): Promise<User> {
    return await this.userModel
      .findOne(filter)
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      })
      .exec();
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel
      .findById(id)
      .populate({
        path: 'role',
        populate: { path: 'permissions' },
      })
      .exec();
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('role createdBy updatedBy')
      .exec();
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessageCode: 'errors.USER_NOT_FOUND',
        i18nErrorTextCode: 'errors.NOT_FOUND',
      } as NotFoundExceptionType);
    }
    return user;
  }

  async remove(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
