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
  make: (path: PathLike, isFolder: boolean) => Observable<Partial<Stats>>; // just touch file or folder
  write: (
    path: PathLike,
    readable: NodeJS.ReadableStream
  ) => Observable<Partial<Stats>>;
  exists: (path: PathLike) => Observable<boolean>;
  remove: (path: PathLike, isFolder: boolean) => Observable<void>;
  archive: (path: PathLike) => Observable<void>;
  read: (path: PathLike) => Observable<NodeJS.ReadableStream>;
  move: (from: PathLike, to: PathLike) => Observable<Partial<Stats>>;
  list: (
    initialPath: PathLike,
    options: Partial<FilesSystemListOptions>,
    depth?: number
  ) => Observable<[OrdoFile | OrdoDirectory]>;
  isFolder: (path: PathLike) => Observable<boolean>;
  isFile: (path: PathLike) => Observable<boolean>;
};
