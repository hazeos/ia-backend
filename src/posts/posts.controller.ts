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
import { MongooseClassSerializerInterceptor } from '../shared/interceptors/mongoose-class-serializer.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequiredPermissions } from '../shared/decorators/required-permissions.decorator';
import { permissions } from '../shared/constants/permissions.constant';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { MongoExceptionFilter } from '../shared/exceptions/mongo-exception.filter';
import { IPostsService } from './interfaces/posts-service.interface';
import { PostsServiceToken } from '../shared/di.tokens';
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { ObjectIdValidationPipe } from '../shared/pipes/object-id-validation.pipe';
import { NotFoundExceptionFilter } from '../shared/exceptions/not-found-exception.filter';
import { UnauthorizedExceptionFilter } from '../shared/exceptions/unauthorized-exception.filter';
import { ForbiddenExceptionFilter } from '../shared/exceptions/forbidden-exception.filter';

@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(MongooseClassSerializerInterceptor(TPost))
@UseFilters(
  MongoExceptionFilter,
  UnauthorizedExceptionFilter,
  ForbiddenExceptionFilter,
)
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
  @UsePipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  )
  @UseFilters(new I18nValidationExceptionFilter({ detailedErrors: false }))
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
  @UseFilters(NotFoundExceptionFilter)
  async findOneById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<TPost> {
    return await this.postsService.findOneById(id);
  }

  @Patch(':id')
  @RequiredPermissions(permissions.posts.update)
  @UsePipes(
    new ValidationPipe({ exceptionFactory: i18nValidationErrorFactory }),
  )
  @UseFilters(
    NotFoundExceptionFilter,
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  )
  async update(
    @Param('id', ObjectIdValidationPipe) id: string,
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
  @UseFilters(NotFoundExceptionFilter)
  async remove(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<TPost> {
    return await this.postsService.remove(id);
  }
}
