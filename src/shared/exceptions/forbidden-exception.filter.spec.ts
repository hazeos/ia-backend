import { ForbiddenExceptionFilter } from './forbidden-exception.filter';

describe('ForbiddenFilter', () => {
  it('should be defined', () => {
    expect(new ForbiddenExceptionFilter()).toBeDefined();
  });
});
