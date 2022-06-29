import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { PostsRepository } from './posts.repository';
import { PostsRepositoryToken, PostsServiceToken } from '../shared/di.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    { provide: PostsServiceToken, useClass: PostsService },
    { provide: PostsRepositoryToken, useClass: PostsRepository },
  ],
  exports: [{ provide: PostsServiceToken, useClass: PostsService }],
})
export class PostsModule {}
