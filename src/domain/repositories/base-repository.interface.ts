import { FilterQuery } from 'mongoose';

export interface Create<T, createDto> {
  create(createDto: createDto): Promise<T>;
}

export interface FindAll<T> {
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
}

export interface FindOne<T> {
  findOne(filter?: FilterQuery<T>): Promise<T>;
}

export interface FindOneById<T> {
  findOneById(id: string): Promise<T>;
}

export interface Update<T, updateDto> {
  update(id: string, updateDto: updateDto): Promise<T>;
}

export interface Remove<T> {
  remove(id: string): Promise<T>;
}
