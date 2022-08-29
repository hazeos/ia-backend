import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { User } from '../../users/entities/user.entity';
import { File } from '../../files/entities/file.entity';
import {
  mockCreatePostDto,
  mockPost,
  mockUpdatePostDto,
} from './mocks/posts.mocks';
import { PostsRepository } from '../posts.repository';
import { PostsRepositoryToken } from '../../shared/di.tokens';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepositoryToken,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost()),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dependencies should be defined', () => {
    expect(postsService).toBeDefined();
    expect(postsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const newPost = await postsService.create(
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
      jest.spyOn(postsRepository, 'findAll').mockResolvedValue([mockPost()]);
      const posts = await postsService.findAll();
      expect(posts).toEqual([mockPost()]);
      expect(postsRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    it('should return a post', async () => {
      const postId = '123';
      jest
        .spyOn(postsRepository, 'findOneById')
        .mockResolvedValue(mockPost(postId));

      const post = await postsService.findOneById(postId);
      expect(post).toEqual(mockPost(postId));
      expect(postsRepository.findOneById).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should update post and return updated post', async () => {
      const postId = '123';
      const postHeader = 'Test';
      const postText = 'Test';
      const postLink = 'test-link';
      const postFiles = [new File()];
      const postUpdateFiles = ['123'];
      jest
        .spyOn(postsRepository, 'update')
        .mockResolvedValue(
          mockPost(postId, postHeader, postText, postLink, postFiles),
        );

      const post = await postsService.update(
        postId,
        mockUpdatePostDto(postHeader, postText, postLink, postUpdateFiles),
      );
      expect(post).toEqual(
        mockPost(postId, postHeader, postText, postLink, postFiles),
      );
      expect(postsRepository.update).toHaveBeenCalledWith(
        postId,
        mockUpdatePostDto(postHeader, postText, postLink, postUpdateFiles),
      );
    });
  });

  describe('remove', () => {
    it('should find a posts by id, remove it and return deleted post', async () => {
      const postId = '1';
      jest.spyOn(postsRepository, 'remove').mockResolvedValue(mockPost(postId));
      const posts = await postsService.remove(postId);
      expect(posts).toEqual(mockPost(postId));
      expect(postsRepository.remove).toHaveBeenCalledWith(postId);
    });
  });
});
