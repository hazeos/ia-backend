import { ObjectIdValidationPipe } from './object-id-validation.pipe';

describe('CheckObjectIdPipe', () => {
  it('should be defined', () => {
    expect(new ObjectIdValidationPipe()).toBeDefined();
  });
});
