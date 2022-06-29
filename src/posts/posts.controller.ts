import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as TPost } from './entities/post.entity';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class-serializer.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequiredPermissions } from '../shared/decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { MongoExceptionFilter } from '../shared/exceptions/mongo-exception.filter';
import { IPostsService } from './interfaces/posts-service.interface';
import { PostsServiceToken } from '../shared/di.tokens';

@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(MongooseClassSerializerInterceptor(TPost))
export class PostsController {
  constructor(
    @Inject(PostsServiceToken)
    private readonly postsService: IPostsService<
      TPost,
      CreatePostDto,
      UpdatePostDto
    >,
  ) {}

  @Post()
  @RequiredPermissions(permissions.posts.create)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req,
  ): Promise<TPost> {
    return await this.postsService.create({
      ...createPostDto,
      createdBy: req.user,
      updatedBy: req.user,
    } as CreatePostDto);
  }

  @Get()
  @RequiredPermissions(permissions.posts.read)
  async findAll(): Promise<TPost[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  @RequiredPermissions(permissions.posts.read)
  async findOneById(@Param('id') id: string): Promise<TPost> {
    return await this.postsService.findOneById(id);
  }

  @Patch(':id')
  @RequiredPermissions(permissions.posts.update)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req,
  ): Promise<TPost> {
    return await this.postsService.update(id, {
      ...updatePostDto,
      updatedBy: req.user,
    } as UpdatePostDto);
  }

  @Delete(':id')
  @RequiredPermissions(permissions.posts.delete)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  async remove(@Param('id') id: string): Promise<TPost> {
    return await this.postsService.remove(id);
  }
}
