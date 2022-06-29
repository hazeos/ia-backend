import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FilterQuery } from 'mongoose';
import { IPostsRepository } from './interfaces/posts-repository.interface';
import { PostsRepositoryToken } from '../shared/di.tokens';
import { IPostsService } from './interfaces/posts-service.interface';

@Injectable()
export class PostsService
  implements IPostsService<Post, CreatePostDto, UpdatePostDto>
{
  constructor(
    @Inject(PostsRepositoryToken)
    private readonly postsRepository: IPostsRepository<
      Post,
      CreatePostDto,
      UpdatePostDto
    >,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return await this.postsRepository.create(createPostDto);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.findAll();
  }

  async findOne(filter: FilterQuery<Post>): Promise<Post> {
    return await this.postsRepository.findOne(filter);
  }

  async findOneById(id: string): Promise<Post> {
    return await this.postsRepository.findOneById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: string): Promise<Post> {
    return await this.postsRepository.remove(id);
  }
}
