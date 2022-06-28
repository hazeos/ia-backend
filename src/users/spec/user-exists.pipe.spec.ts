import { UserExistsValidationPipe } from '../pipes/user-exists.pipe';
import { IUsersService } from '../interfaces/users-service.interface';

// TODO Тест
describe('UserExistsValidationPipe', () => {
  let usersService: IUsersService<any, any, any>;
  it('should be defined', () => {
    expect(new UserExistsValidationPipe(usersService)).toBeDefined();
  });
});
