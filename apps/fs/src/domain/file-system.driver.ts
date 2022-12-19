import { OrdoDirectory, OrdoFile } from '@ordo/types';
import type { PathLike, Stats } from 'fs';
import type { Observable } from 'rxjs';

export enum SORT {
  ASC = 1,
  DESC = -1,
}

export type FilesSystemListOptions = {
  depth: number;
  length: number;
  skip: number;
  updatedAt: SORT;
  createdAt: SORT;
};

export type FileSystemDriver = {
  make: (path: PathLike, isDirectory: boolean) => Observable<Partial<Stats>>; // just touch file or directory
  write: (
    path: PathLike,
    readable: NodeJS.ReadableStream
  ) => Observable<Partial<Stats>>;
  exists: (path: PathLike) => Observable<boolean>;
  remove: (path: PathLike, isDirectory: boolean) => Observable<void>;
  archive: (path: PathLike) => Observable<void>;
  read: (path: PathLike) => Observable<NodeJS.ReadableStream>;
  move: (from: PathLike, to: PathLike) => Observable<Partial<Stats>>;
  list: (
    initialPath: PathLike,
    options: Partial<FilesSystemListOptions>,
    depth?: number
  ) => Observable<[OrdoFile | OrdoDirectory]>;
  isDirectory: (path: PathLike) => Observable<boolean>;
  isFile: (path: PathLike) => Observable<boolean>;
  stat: (path: PathLike) => Observable<Stats>;
};
