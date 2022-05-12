import { FilesRepository } from '../files.repository';

describe('FilesRepository', () => {
  it('should be defined', () => {
    expect(new FilesRepository()).toBeDefined();
  });
});
