import { Role } from '../../../schemas/role.schema';
import { User } from '../../../users/entities/user.entity';
import { ExecutionContext } from '@nestjs/common';
import { Permission } from '../../../schemas/permission.schema';

export const accessToken = 'jwt';

export const mockUser = (
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

export const mockLoginResponse = (): {
  accessToken: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  role: Role;
} => ({
  accessToken: accessToken,
  firstName: 'Тест',
  lastName: 'Тестович',
  middleName: 'Тестов',
  email: 'test@test.com',
  role: new Role(),
});

export const mockProfileResponse = (
  _id = '12345',
  firstName = 'Тест',
  lastName = 'Тестович',
  middleName = 'Тестов',
  email = 'test@test.com',
  role: Role = new Role(),
  createdAt = '2021-09-08T21:00:00.000Z',
  updatedAt = '2021-09-08T21:00:00.000Z',
): {
  firstName: string;
  lastName: string;
  createdAt: string;
  role: Role;
  middleName: string;
  _id: string;
  email: string;
  updatedAt: string;
} => ({
  _id,
  firstName,
  lastName,
  middleName,
  email,
  role,
  createdAt,
  updatedAt,
});

export const mockContext = (permissions: Permission[]): ExecutionContext =>
  <ExecutionContext>{
    switchToHttp: () => ({
      getRequest: () => ({
        user: mockUser(
          '12345',
          'Тест',
          'Тестович',
          'Тестов',
          'test@test.com',
          '',
          {
            _id: '',
            name: '',
            displayName: '',
            permissions: permissions,
          },
        ),
      }),
    }),
    getHandler: () => ({}),
  };
