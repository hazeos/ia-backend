import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostsRepository } from './repository/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return await this.postsRepository.create(createPostDto);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.findAll();
  }

  async findOne(id: string): Promise<Post> {
    return await this.postsRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    return await this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: string): Promise<Post> {
    return await this.postsRepository.remove(id);
  }
}
