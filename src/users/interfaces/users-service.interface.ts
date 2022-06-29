import {
  Create,
  FindAll,
  FindOne,
  FindOneById,
  Remove,
  Update,
} from '../../shared/services/base-service.interface';

export interface IUsersService<T, createDto, updateDto>
  extends Create<T, createDto>,
    FindAll<T>,
    FindOne<T>,
    FindOneById<T>,
    Update<T, updateDto>,
    Remove<T> {}
