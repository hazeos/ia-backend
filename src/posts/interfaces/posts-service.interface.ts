import { IBaseService } from '../../domain/services/base-service.interface';

export type IPostsService<T, createDto, updateDto> = IBaseService<
  T,
  createDto,
  updateDto
>;
