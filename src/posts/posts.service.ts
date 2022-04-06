import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel
      .find()
      .populate({
        path: 'files',
        populate: { path: 'createdBy updatedBy' },
      })
      .populate('createdBy updatedBy')
      .exec();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postModel
      .findById(id)
      .populate({
        path: 'files',
        populate: { path: 'createdBy updatedBy' },
      })
      .populate('createdBy updatedBy')
      .exec();
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
