import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files.service';
import { FilesRepository } from '../files.repository';
import { FilesRepositoryToken } from '../../shared/di.tokens';
import {
  mockCreateFileDto,
  mockFile,
  mockUpdateFileDto,
} from './mocks/files.mocks';
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

  describe('findOneById', () => {
    it('should return a file', async () => {
      const fileId = '123';
      jest
        .spyOn(filesRepository, 'findOneById')
        .mockResolvedValue(mockFile(fileId));

      const post = await filesService.findOneById(fileId);
      expect(post).toEqual(mockFile(fileId));
      expect(filesRepository.findOneById).toHaveBeenCalledWith(fileId);
    });
  });

  describe('update', () => {
    it('should update file and return updated file', async () => {
      const fileId = '123';
      const fileName = 'Test';
      const filePath = './uploads';
      jest
        .spyOn(filesRepository, 'update')
        .mockResolvedValue(mockFile(fileId, fileName, filePath));

      const file = await filesService.update(
        fileId,
        mockUpdateFileDto(fileName, filePath),
      );
      expect(file).toEqual(mockFile(fileId, fileName, filePath));
      expect(filesRepository.update).toHaveBeenCalledWith(
        fileId,
        mockUpdateFileDto(fileName, filePath),
      );
    });
  });

  describe('remove', () => {
    it('should find a file by id, remove it and return deleted file', async () => {
      const fileId = '1';
      jest.spyOn(filesRepository, 'remove').mockResolvedValue(mockFile(fileId));
      const files = await filesService.remove(fileId);
      expect(files).toEqual(mockFile(fileId));
      expect(filesRepository.remove).toHaveBeenCalledWith(fileId);
    });
  });
});
