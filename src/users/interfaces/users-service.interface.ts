import { IBaseService } from '../../domain/services/base-service.interface';

export type IUsersService<T, createDto, updateDto> = IBaseService<
  T,
  createDto,
  updateDto
>;
