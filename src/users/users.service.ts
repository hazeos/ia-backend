import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel
      .findOne({ email: email })
      .populate({
        path: 'role',
        select: '-_id',
        populate: { path: 'permissions', select: '-_id' },
      })
      .exec();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id, '-password')
      .populate({
        path: 'role',
        select: '-_id',
        populate: { path: 'permissions', select: '-_id' },
      })
      .exec();
    if (!user) {
      throw new NotFoundException(undefined, 'User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
