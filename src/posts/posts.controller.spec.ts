import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../schemas/user.schema';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((createPostDto: CreatePostDto) =>
                Promise.resolve({
                  _id: '1',
                  ...createPostDto,
                }),
              ),
            findAll: jest.fn().mockImplementation(() =>
              Promise.resolve([
                {
                  _id: '1',
                  header: 'Test',
                  text: 'Test',
                  files: [],
                  createdBy: 'TestUser',
                  updatedBy: 'TestUser',
                  createdAt: 'SomeTime',
                  updatedAt: 'SomeTime',
                },
              ]),
            ),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                _id: id,
                header: 'Test',
                text: 'Test',
                files: [],
                createdBy: 'TestUser',
                updatedBy: 'TestUser',
                createdAt: 'SomeTime',
                updatedAt: 'SomeTime',
              }),
            ),
            update: jest
              .fn()
              .mockImplementation((id: string, updatePostDto: UpdatePostDto) =>
                Promise.resolve({
                  _id: id,
                  header: updatePostDto.header,
                  text: updatePostDto.text,
                  files: updatePostDto.files,
                  createdBy: 'TestUser',
                  updatedBy: 'TestUser',
                  createdAt: 'SomeTime',
                  updatedAt: 'SomeTime',
                }),
              ),
            remove: jest.fn().mockImplementation(() =>
              Promise.resolve({
                _id: '1',
                header: 'Test',
                text: 'Test',
                files: [],
                createdBy: 'TestUser',
                updatedBy: 'TestUser',
                createdAt: 'SomeTime',
                updatedAt: 'SomeTime',
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        header: 'Test',
        text: 'Test',
        files: [],
        createdBy: new User(),
        updatedBy: new User(),
      };
      await expect(
        controller.create(createPostDto, { user: new User() }),
      ).resolves.toEqual({
        _id: '1',
        ...createPostDto,
      });
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      await expect(controller.findAll()).resolves.toEqual([
        {
          _id: '1',
          header: 'Test',
          text: 'Test',
          files: [],
          createdBy: 'TestUser',
          updatedBy: 'TestUser',
          createdAt: 'SomeTime',
          updatedAt: 'SomeTime',
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return post', async () => {
      await expect(controller.findOne('1')).resolves.toEqual({
        _id: '1',
        header: 'Test',
        text: 'Test',
        files: [],
        createdBy: 'TestUser',
        updatedBy: 'TestUser',
        createdAt: 'SomeTime',
        updatedAt: 'SomeTime',
      });
      expect(service.findOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        header: 'Test',
        text: 'Test',
        files: [],
      };
      await expect(
        controller.update('1', updatePostDto, { user: new User() }),
      ).resolves.toEqual({
        _id: '1',
        header: updatePostDto.header,
        text: updatePostDto.text,
        files: updatePostDto.files,
        createdBy: 'TestUser',
        updatedBy: 'TestUser',
        createdAt: 'SomeTime',
        updatedAt: 'SomeTime',
      });
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove post', async () => {
      await expect(controller.remove('1')).resolves.toEqual({
        _id: '1',
        header: 'Test',
        text: 'Test',
        files: [],
        createdBy: 'TestUser',
        updatedBy: 'TestUser',
        createdAt: 'SomeTime',
        updatedAt: 'SomeTime',
      });
      expect(service.remove).toHaveBeenCalled();
    });
  });
});
