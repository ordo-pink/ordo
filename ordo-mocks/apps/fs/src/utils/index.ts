import { SORT } from '../domain';

export const toSort = (str: 'ASC' | 'DESC' | undefined): SORT =>
  str.toUpperCase() === 'ASC'
    ? SORT.ASC
    : str.toUpperCase() === 'DESC'
    ? SORT.DESC
    : undefined;

export const sort = (key, type: SORT) => (a, b) =>
  a[key] > b[key] ? type : -type;

export const sortByCreatedAt = (createdAt) =>
  createdAt ? sort('createdAt', createdAt) : void 0;
export const sortByUpdatedAt = (updatedAt) =>
  updatedAt ? sort('updatedAt', updatedAt) : void 0;

export * from './is-authorized';
