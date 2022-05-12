import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { mockUser, accessToken } from './mocks/auth.mocks';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  const credentials = {
    email: 'test@test.com',
    password: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(mockUser()),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(accessToken),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Dependencies should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateCredentials', () => {
    it('should validate given credentials', async () => {
      const result = await authService.validateCredentials(
        credentials.email,
        credentials.password,
      );
      expect(result).toEqual(mockUser());
    });

    it('should fail validating given credentials', async () => {
      const result = await authService.validateCredentials(
        credentials.email,
        credentials.password + '1',
      );
      expect(result).toEqual(false);
    });
  });

  describe('login', () => {
    it('should sign jwt and return user info', async () => {
      const user = mockUser();
      const result = await authService.login(user);
      expect(result).toEqual({
        accessToken: accessToken,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        role: user.role,
      });
    });
  });
});
