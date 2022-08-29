import { UnauthorizedExceptionFilter } from './unauthorized-exception.filter';

describe('UnauthorizedFilter', () => {
  it('should be defined', () => {
    expect(new UnauthorizedExceptionFilter()).toBeDefined();
  });
});
