import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  UseFilters,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as TPost } from '../schemas/post.schema';
import { MongooseClassSerializerInterceptor } from '../interceptors/mongoose-class-serializer.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequiredPermissions } from '../decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { MongoExceptionFilter } from '../exceptions/mongo-exception.filter';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @RequiredPermissions(permissions.posts.create)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UsePipes(ValidationPipe)
  @UseFilters(MongoExceptionFilter)
  @UseInterceptors(MongooseClassSerializerInterceptor(TPost))
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(TPost))
  async findAll(): Promise<TPost[]> {
    return await this.postsService.findAll();
  }

  @Get(':id')
  @RequiredPermissions(permissions.posts.read)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @UseInterceptors(MongooseClassSerializerInterceptor(TPost))
  async findOne(@Param('id') id: string): Promise<TPost> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
