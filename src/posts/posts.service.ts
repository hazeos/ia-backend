import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { FilterQuery } from 'mongoose';
import { IPostsRepository } from './interfaces/posts-repository.interface';
import { PostsRepositoryToken } from '../shared/di.tokens';
import { IPostsService } from './interfaces/posts-service.interface';
import { NotFoundExceptionBodyType } from '../shared/exceptions/exceptions.types';

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
    const post = await this.postsRepository.findOne(filter);
    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.POSTS.POST_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionBodyType);
    }
    return post;
  }

  async findOneById(id: string): Promise<Post> {
    const post = await this.postsRepository.findOneById(id);
    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.POSTS.POST_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionBodyType);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postsRepository.update(id, updatePostDto);
    if (!post) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        i18nMessage: 'errors.POSTS.POST_NOT_FOUND',
        i18nErrorText: 'errors.HTTP.NOT_FOUND',
      } as NotFoundExceptionBodyType);
    }
    return post;
  }

  async remove(id: string): Promise<Post> {
    return await this.postsRepository.remove(id);
  }
}
