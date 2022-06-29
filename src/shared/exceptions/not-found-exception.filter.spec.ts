import { NotFoundExceptionFilter } from './not-found-exception.filter';

// TODO Тест
describe('NotFoundFilter', () => {
  it('should be defined', () => {
    expect(new NotFoundExceptionFilter()).toBeDefined();
  });
});
