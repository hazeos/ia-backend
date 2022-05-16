import { IBaseRepository } from '../../domain/repositories/base-repository.interface';

export type IPostsRepository<T, createDto, updateDto> = IBaseRepository<
  T,
  createDto,
  updateDto
>;
