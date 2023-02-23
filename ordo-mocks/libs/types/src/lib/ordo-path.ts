import {PathLike, Stats} from 'fs';
import {relative, basename, extname} from 'path';

export type OrdoPathLike = string;
export type OrdoPath = OrdoPathLike;
export type OrdoRelativePath = OrdoPathLike;
export type OrdoFileExtension = `.${string}`;

export interface OrdoFSElement {
  path: OrdoRelativePath;
  readableName: string;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
  accessedAt: Date;
}

export interface OrdoFile extends OrdoFSElement {
  extension: string | null;
  size: number;
}

export interface OrdoDirectory extends OrdoFSElement {
  children: (OrdoFile | OrdoDirectory)[];
}

export const makeOrdoDirectory =
  (initialPath: PathLike) =>
    (path: OrdoPath, stat: Stats, depth: number): OrdoDirectory => {
      return {
        children: [],
        path: relative(initialPath.toString(), path) || '/',
        readableName: basename(path),
        depth,
        createdAt: stat.birthtime,
        updatedAt: stat.mtime,
        accessedAt: stat.atime,
      };
    };

export const makeOrdoFile =
  (initialPath: PathLike) =>
    (path: OrdoPath, stat: Stats, depth: number): OrdoFile => {
      return {
        extension: extname(path),
        size: stat.size,
        path: relative(initialPath.toString(), path),
        readableName: basename(path),
        depth,
        createdAt: stat.birthtime,
        updatedAt: stat.mtime,
        accessedAt: stat.atime,
      };
    };
