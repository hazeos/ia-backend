import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  mockUser,
  accessToken,
  mockLoginResponse,
  mockProfileResponse,
} from './mocks/auth.mocks';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateCredentials: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Dependencies should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should sign jwt and return user info', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse());
      const req = { user: mockUser() };
      const result = await authController.login(req);
      expect(result).toEqual({
        accessToken: accessToken,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        middleName: req.user.middleName,
        email: req.user.email,
        role: req.user.role,
      });
    });
  });

  describe('getProfile', () => {
    it('should return user info', async () => {
      const req = { user: mockProfileResponse() };
      const result = await authController.getProfile(req);
      expect(result).toEqual({
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        middleName: req.user.middleName,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      });
    });
  });
});
