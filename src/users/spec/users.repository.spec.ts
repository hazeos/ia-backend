import { UsersRepository } from '../users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { mockPost } from '../../posts/spec/mocks/posts.mocks';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entity';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let usersModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
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

    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Dependencies should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(usersModel).toBeDefined();
  });
});
