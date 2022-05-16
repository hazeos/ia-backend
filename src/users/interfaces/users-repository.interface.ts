import { IBaseService } from '../../domain/services/base-service.interface';

export type IUsersRepository<T, createDto, updateDto> = IBaseService<
  T,
  createDto,
  updateDto
>;
