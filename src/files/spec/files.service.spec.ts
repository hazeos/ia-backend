import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files.service';
import { FilesRepository } from '../files.repository';
import { FilesRepositoryToken } from '../../shared/di.tokens';
import { mockCreateFileDto, mockFile } from './mocks/files.mocks';
import { realpathSync } from 'fs';
import { User } from '../../users/entities/user.entity';

describe('FilesService', () => {
  let filesService: FilesService;
  let filesRepository: FilesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: FilesRepositoryToken,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFile()),
            findAll: jest.fn().mockResolvedValue([mockFile()]),
            findOne: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
    filesRepository = module.get<FilesRepository>(FilesRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('dependencies should be defined', () => {
    expect(filesService).toBeDefined();
    expect(filesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a file', async () => {
      const newPost = await filesService.create(
        mockCreateFileDto(
          'test',
          realpathSync('./uploads'),
          new User(),
          new User(),
        ),
      );
      expect(newPost).toEqual(mockFile());
    });
  });

  describe('findAll', () => {
    it('should return an array of files', async () => {
      const files = await filesService.findAll();
      expect(files).toEqual([mockFile()]);
      expect(filesRepository.findAll).toHaveBeenCalled();
    });
  });
});
