import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../entities/post.entity';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../schemas/user.schema';
import { File } from '../../schemas/file.schema';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsRepository } from './posts.repository';

const mockCreatePostDto = (
  header = 'Test',
  text = 'Test',
  files = [''],
  createdBy = new User(),
  updatedBy = new User(),
): CreatePostDto => ({
  header,
  text,
  files,
  createdBy,
  updatedBy,
});

const mockUpdatePostDto = (
  header = 'Test',
  text = 'Test',
  files = ['123'],
): UpdatePostDto => ({
  header,
  text,
  files,
});

const mockPost = (
  _id = '1',
  header = 'Test',
  text = 'Test',
  files = [new File()],
  createdBy = new User(),
  updatedBy = new User(),
): Post => ({
  _id,
  header,
  text,
  files,
  createdBy,
  updatedBy,
});

describe('PostsRepository', () => {
  let repository: PostsRepository;
  let postModel: Model<PostDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: getModelToken(Post.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost()),
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

    repository = module.get<PostsRepository>(PostsRepository);
    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(postModel).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const newPost = await repository.create(
        mockCreatePostDto('Test', 'Test', [], new User(), new User()),
      );
      expect(newPost).toEqual(mockPost('1', 'Test', 'Test', [new File()]));
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockPost()]),
      } as any);
      const posts = await repository.findAll();
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

      const post = await repository.findOne(postId);
      expect(post).toEqual(mockPost(postId));
      expect(postModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update post and return updated post', async () => {
      const postId = '123';
      const postHeader = 'Test';
      const postText = 'Test';
      const postFiles = [new File()];
      const postUpdateFiles = ['123'];
      jest.spyOn(postModel, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest
          .fn()
          .mockResolvedValue(mockPost(postId, postHeader, postText, postFiles)),
      } as any);

      const post = await repository.update(
        postId,
        mockUpdatePostDto(postHeader, postText, postUpdateFiles),
      );
      expect(post).toEqual(mockPost(postId, postHeader, postText, postFiles));
      expect(postModel.findByIdAndUpdate).toHaveBeenCalledWith(
        postId,
        mockUpdatePostDto(postHeader, postText, postUpdateFiles),
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
      const posts = await repository.remove(postId);
      expect(posts).toEqual(mockPost(postId));
      expect(postModel.findByIdAndDelete).toHaveBeenCalledWith(postId);
    });
  });
});
