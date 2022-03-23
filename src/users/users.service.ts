import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/user.schema';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ id: id });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
