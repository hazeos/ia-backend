import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post as TPost, Post, PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
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

  async update(id: string, updatePostDto: UpdatePostDto): Promise<TPost> {
    return await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .populate('createdBy updatedBy')
      .exec();
  }

  async remove(id: string): Promise<TPost> {
    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
