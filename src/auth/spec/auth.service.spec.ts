import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../schemas/role.schema';

const mockUser = (
  _id = '12345',
  firstName = 'Тест',
  lastName = 'Тестович',
  middleName = 'Тестов',
  email = 'test@test.com',
  password = '$2a$12$Auh07fMDArugiTWO69rSAuO1NZ0aLqoX85cITUy7JsEUN5Fwxj6Eu',
  role: Role = new Role(),
): User => ({
  _id,
  firstName,
  lastName,
  middleName,
  email,
  password,
  role,
});

const accessToken = 'jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

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

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateCredentials', () => {
    it('should validate given credentials', async () => {
      const credentials = {
        email: 'test@test.com',
        password: 'test',
      };
      const goodResult = await authService.validateCredentials(
        credentials.email,
        credentials.password,
      );
      const badResult = await authService.validateCredentials(
        credentials.email,
        credentials.password + '1',
      );
      expect(goodResult).toEqual(mockUser());
      expect(badResult).toEqual(false);
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
        role: new Role(),
      });
    });
  });
});
