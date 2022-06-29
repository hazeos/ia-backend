import {
  Create,
  FindAll,
  FindOne,
  FindOneById,
  Remove,
  Update,
} from '../../shared/repositories/base-repository.interface';

export interface IUsersRepository<T, createDto, updateDto>
  extends Create<T, createDto>,
    FindAll<T>,
    FindOne<T>,
    FindOneById<T>,
    Update<T, updateDto>,
    Remove<T> {}
