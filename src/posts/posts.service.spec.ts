import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { File } from '../schemas/file.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
  files = [''],
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

describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<PostDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Post.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockPost()),
            constructor: jest.fn().mockResolvedValue(mockPost()),
            create: jest.fn().mockResolvedValue(mockPost()),
            populate: jest.fn().mockResolvedValue([mockPost()]),
            find: jest.fn().mockResolvedValue([mockPost()]),
            findOne: jest.fn().mockResolvedValue(mockPost()),
            update: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get<Model<PostDocument>>(getModelToken(Post.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const newPost = await service.create(
        mockCreatePostDto('Test', 'Test', [], new User(), new User()),
      );
      expect(newPost).toEqual(mockPost('1', 'Test', 'Test', [new File()]));
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = await service.findAll();
      expect(posts).toEqual([mockPost()]);
    });
  });
});
