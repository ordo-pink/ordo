/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContextToken, createReader } from '@marblejs/core';
import { sortByCreatedAt, sortByUpdatedAt } from '@ordo-fs/utils';
import {
  OrdoPath,
  OrdoDirectory,
  OrdoFile,
  makeOrdoDirectory,
  makeOrdoFile,
} from '@ordo/types';
import {
  constants,
  createReadStream,
  createWriteStream,
  PathLike,
  promises,
  Stats,
} from 'fs';
import { basename, dirname, join } from 'path';
import {
  Observable,
  from,
  switchMap,
  map,
  catchError,
  of,
  defer,
  throwError,
  mergeMap,
  reduce,
  takeWhile,
} from 'rxjs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { FilesSystemListOptions, FileSystemDriver } from '../domain';

const asyncPipeline = promisify(pipeline);

const make = (path: PathLike, isDirectory: boolean): Observable<Stats> => {
  if (isDirectory) {
    return from(promises.mkdir(path, { recursive: true })).pipe(
      mergeMap(() => from(promises.stat(path)))
    );
  } else {
    return from(
      promises.mkdir(dirname(path.toString()), { recursive: true })
    ).pipe(
      mergeMap(() => from(promises.open(path, 'a'))),
      mergeMap((fh) => from(fh.close())),
      mergeMap(() => from(promises.stat(path)))
    );
  }
};

const write = (
  path: PathLike,
  readable: NodeJS.ReadableStream
): Observable<Stats> =>
  from(asyncPipeline(readable, createWriteStream(path))).pipe(
    mergeMap(() => from(promises.stat(path)))
  );

const exists = (path: PathLike): Observable<boolean> =>
  from(promises.access(path, constants.F_OK)).pipe(
    catchError(() => of(false)),
    map((res) => (typeof res === 'undefined' ? true : false))
  );

const read = (path: PathLike): Observable<NodeJS.ReadableStream> =>
  of(path).pipe(mergeMap((path) => of(createReadStream(path))));

const remove = (path: PathLike, isDirectory: boolean): Observable<void> =>
  from(promises.lstat(path)).pipe(
    mergeMap((stat) =>
      defer(() =>
        stat.isDirectory() === isDirectory
          ? from(promises.rm(path, { recursive: true, force: true }))
          : throwError(() => new Error("Cant't remove that"))
      )
    )
  );

const archive = (path: PathLike): Observable<void> => {
  const directory = dirname(path.toString());
  const archiveDirectory = join(directory, '.archive');
  return of(archiveDirectory).pipe(
    mergeMap((archiveDirectory) =>
      make(archiveDirectory, true).pipe(map(() => archiveDirectory))
    ),
    mergeMap((archiveDirectory) =>
      from(
        promises.rename(
          path,
          join(archiveDirectory, `${basename(path.toString())}%${Date.now()}`)
        )
      )
    )
  );
};

const readDir$ =
  (
    directoryMap: (path: OrdoPath, stat: Stats, depth: number) => OrdoDirectory,
    fileMap: (path: OrdoPath, stat: Stats, depth: number) => OrdoFile
  ) =>
  (
    initialPath: PathLike,
    options: Partial<FilesSystemListOptions>,
    depth = 1
  ) =>
    of(initialPath).pipe(
      takeWhile(() => options.depth >= depth),
      switchMap((path) => from(promises.readdir(path))),
      mergeMap((paths) => from(paths)),
      map((path) => join(initialPath.toString(), path)),
      mergeMap((path) =>
        from(promises.lstat(path)).pipe(
          map((stat) =>
            stat.isFile()
              ? fileMap(path, stat, depth)
              : directoryMap(path, stat, depth)
          )
        )
      ),
      mergeMap((dto: OrdoFile | OrdoDirectory) =>
        'children' in dto && Array.isArray(dto.children)
          ? readDir$(directoryMap, fileMap)(
              join(initialPath.toString(), basename(dto.path)),
              options,
              depth + 1
            ).pipe(
              map((childrens: [OrdoFile | OrdoDirectory]) => {
                dto.children = childrens
                  .sort(sortByCreatedAt(options.createdAt))
                  .sort(sortByUpdatedAt(options.updatedAt));
                return dto;
              })
            )
          : of(dto)
      ),
      reduce((acc, dto) => [...acc, dto], [])
    );

const list = (
  initialPath: PathLike,
  options: Partial<FilesSystemListOptions>
): Observable<[OrdoDirectory | OrdoFile]> => {
  const readDir = readDir$(
    makeOrdoDirectory(initialPath),
    makeOrdoFile(initialPath)
  );
  return readDir(initialPath, options);
};

const move = (path: PathLike, to: PathLike): Observable<Partial<Stats>> =>
  from(promises.rename(path, to)).pipe(mergeMap(() => from(promises.stat(to))));

const stat = (path: PathLike): Observable<Stats> => from(promises.stat(path));

const isFile = (path: PathLike): Observable<boolean> =>
  from(promises.lstat(path)).pipe(map((lstat) => lstat.isFile()));

const isDirectory = (path: PathLike): Observable<boolean> =>
  from(promises.lstat(path)).pipe(map((lstat) => lstat.isDirectory()));

export const FileSystemContext = createReader(
  (): FileSystemDriver => ({
    make,
    exists,
    read,
    remove,
    archive,
    write,
    list,
    move,
    isFile,
    isDirectory,
    stat,
  })
);

export type FileSystemContext = ReturnType<typeof FileSystemContext>;

export const FileSystemToken =
  createContextToken<FileSystemDriver>('FileSystemDriver');
