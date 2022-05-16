import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { IPostsRepositoryToken, IPostsServiceToken } from '../domain/di.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    { provide: IPostsServiceToken, useClass: PostsService },
    { provide: IPostsRepositoryToken, useClass: PostsRepository },
  ],
  exports: [{ provide: IPostsServiceToken, useClass: PostsService }],
})
export class PostsModule {}
