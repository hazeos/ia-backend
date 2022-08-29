import { PermissionsGuard } from '../guards/permissions.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { mockContext } from './mocks/auth.mocks';

describe('PermissionsGuard', () => {
  let permissionsGuard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: {
            constructor: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    permissionsGuard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('dependencies should be defined', () => {
    expect(permissionsGuard).toBeDefined();
    expect(reflector).toBeDefined();
  });

  describe('canActivate', () => {
    it('should check that user have required permissions', async () => {
      jest
        .spyOn(reflector, 'get')
        .mockReturnValue([
          'permissions.posts.read',
          'permissions.posts.create',
        ]);
      const contextMock = mockContext([
        { _id: '', name: 'permissions.posts.read', description: '' },
        { _id: '', name: 'permissions.posts.create', description: '' },
      ]);
      const result = permissionsGuard.canActivate(contextMock);
      expect(result).toBe(true);
    });

    it('should check that user do not have required permissions', async () => {
      jest
        .spyOn(reflector, 'get')
        .mockReturnValue([
          'permissions.posts.read',
          'permissions.posts.create',
        ]);
      const contextMock = mockContext([
        { _id: '', name: 'permissions.posts.update', description: '' },
      ]);
      const result = permissionsGuard.canActivate(contextMock);
      expect(result).toBe(false);
    });

    it('should be true if user have some of required permissions', async () => {
      jest
        .spyOn(reflector, 'get')
        .mockReturnValue([
          'permissions.posts.read',
          'permissions.posts.create',
        ]);
      const contextMock = mockContext([
        { _id: '', name: 'permissions.posts.read', description: '' },
      ]);
      const result = permissionsGuard.canActivate(contextMock);
      expect(result).toBe(true);
    });
  });
});
