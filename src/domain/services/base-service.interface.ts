import { FilterQuery } from 'mongoose';

export interface IBaseService<T, createDto, updateDto> {
  create(createDto: createDto): Promise<T>;
  findAll(): Promise<T[]>;
  findOne(filter: FilterQuery<T>): Promise<T>;
  findOneById(id: string): Promise<T>;
  update(id: string, updateDto: updateDto): Promise<T>;
  remove(id: string): Promise<T>;
}
