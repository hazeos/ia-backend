import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { User } from '../../users/entities/user.entity';
import {
  mockPost,
  mockCreatePostDto,
  mockUpdatePostDto,
} from './mocks/posts.mocks';
import { File } from '../../files/entities/file.entity';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost()),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('Dependencies should be defined', () => {
    expect(postsController).toBeDefined();
    expect(postsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const newPost = await postsController.create(
        mockCreatePostDto('Test', 'Test', [], new User(), new User()),
        { user: new User() },
      );
      expect(newPost).toEqual(mockPost('1', 'Test', 'Test', [new File()]));
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postsService, 'findAll').mockResolvedValue([mockPost()]);
      const posts = await postsController.findAll();
      expect(posts).toEqual([mockPost()]);
      expect(postsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const postId = '123';
      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPost(postId));
      const post = await postsController.findOne(postId);
      expect(post).toEqual(mockPost(postId));
      expect(postsService.findOne).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should update post and return updated post', async () => {
      const postId = '123';
      const postHeader = 'Test';
      const postText = 'Test';
      const postFiles = [new File()];
      const postUpdateFiles = ['123'];
      jest
        .spyOn(postsService, 'update')
        .mockResolvedValue(mockPost(postId, postHeader, postText, postFiles));

      const post = await postsController.update(
        postId,
        mockUpdatePostDto(postHeader, postText, postUpdateFiles),
        { user: new User() },
      );
      expect(post).toEqual(mockPost(postId, postHeader, postText, postFiles));
      expect(postsService.update).toHaveBeenCalledWith(postId, {
        ...mockUpdatePostDto(postHeader, postText, postUpdateFiles),
        updatedBy: new User(),
      });
    });
  });

  describe('remove', () => {
    it('should find a posts by id, remove it and return deleted post', async () => {
      const postId = '1';
      jest.spyOn(postsService, 'remove').mockResolvedValue(mockPost(postId));
      const posts = await postsController.remove(postId);
      expect(posts).toEqual(mockPost(postId));
      expect(postsService.remove).toHaveBeenCalledWith(postId);
    });
  });
});
