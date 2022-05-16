import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { FilterQuery, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPostsRepository } from './interfaces/posts-repository.interface';

@Injectable()
export class PostsRepository
  implements IPostsRepository<Post, CreatePostDto, UpdatePostDto>
{
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createDto: CreatePostDto): Promise<Post> {
    return await this.postModel.create(createDto);
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

  async findOne(filter: FilterQuery<Post>): Promise<Post> {
    return await this.postModel
      .findOne(filter)
      .populate({
        path: 'files',
        populate: { path: 'createdBy updatedBy' },
      })
      .populate('createdBy updatedBy')
      .exec();
  }

  async findOneById(id: string): Promise<Post> {
    return await this.postModel
      .findById(id)
      .populate({
        path: 'files',
        populate: { path: 'createdBy updatedBy' },
      })
      .populate('createdBy updatedBy')
      .exec();
  }

  async update(id: string, updateDto: UpdatePostDto): Promise<Post> {
    return await this.postModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('createdBy updatedBy')
      .exec();
  }

  async remove(id: string): Promise<Post> {
    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
