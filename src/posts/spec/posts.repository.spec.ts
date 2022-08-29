import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../entities/post.entity';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';
import { PostsRepository } from '../posts.repository';
import {
  mockCreatePostDto,
  mockPost,
  mockUpdatePostDto,
} from './mocks/posts.mocks';

describe('PostsRepository', () => {
  let postsRepository: PostsRepository;
  let postModel: Model<PostDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: getModelToken(Post.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            populate: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    postsRepository = module.get<PostsRepository>(PostsRepository);
    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dependencies should be defined', () => {
    expect(postsRepository).toBeDefined();
    expect(postModel).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      jest.spyOn(postModel, 'create').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPost()),
      } as any);
      const newPost = await postsRepository.create(
        mockCreatePostDto(
          'Test',
          'Test',
          'test-link',
          [],
          new User(),
          new User(),
        ),
      );
      expect(newPost).toEqual(
        mockPost('1', 'Test', 'Test', 'test-link', [new File()]),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPost()]),
      } as any);
      const posts = await postsRepository.findAll();
      expect(posts).toEqual([mockPost()]);
      expect(postModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a post', async () => {
      const postId = '123';
      jest.spyOn(postModel, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPost(postId)),
      } as any);

      const post = await postsRepository.findOneById(postId);
      expect(post).toEqual(mockPost(postId));
      expect(postModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update post and return updated post', async () => {
      const postId = '123';
      const postHeader = 'Test';
      const postText = 'Test';
      const postLink = 'test-link';
      const postFiles = [new File()];
      const postUpdateFiles = ['123'];
      jest.spyOn(postModel, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest
          .fn()
          .mockResolvedValue(
            mockPost(postId, postHeader, postText, postLink, postFiles),
          ),
      } as any);

      const post = await postsRepository.update(
        postId,
        mockUpdatePostDto(postHeader, postText, postLink, postUpdateFiles),
      );
      expect(post).toEqual(
        mockPost(postId, postHeader, postText, postLink, postFiles),
      );
      expect(postModel.findByIdAndUpdate).toHaveBeenCalledWith(
        postId,
        mockUpdatePostDto(postHeader, postText, postLink, postUpdateFiles),
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should find a posts by id, remove it and return deleted post', async () => {
      const postId = '1';
      jest.spyOn(postModel, 'findByIdAndDelete').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockPost(postId)),
      } as any);
      const posts = await postsRepository.remove(postId);
      expect(posts).toEqual(mockPost(postId));
      expect(postModel.findByIdAndDelete).toHaveBeenCalledWith(postId);
    });
  });
});
