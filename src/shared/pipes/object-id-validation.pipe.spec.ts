import { ObjectIdValidationPipe } from './object-id-validation.pipe';

// TODO Тест
describe('CheckObjectIdPipe', () => {
  it('should be defined', () => {
    expect(new ObjectIdValidationPipe()).toBeDefined();
  });
});
