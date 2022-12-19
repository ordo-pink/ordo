import { useContext } from '@marblejs/core';
import { HttpError, HttpStatus, r } from '@marblejs/http';
import { defer, Observable, throwError, from as from$, of, from } from 'rxjs';
import { catchError, map, mergeMap, reduce, retryWhen } from 'rxjs/operators';
import { ListDirectoryRequest } from '../types';
import { isPathParamsInHeaderExists$ } from '../middlewares';
import { sortByCreatedAt, sortByUpdatedAt, toSort } from '@ordo-fs/utils';
import { FileSystemToken, PathExchangeToken } from '@ordo-fs/contexts';
import { OrdoHeaderPath } from '@ordo-fs/domain';
import { makeOrdoDirectory } from '@ordo/types';

export const listDirectory$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.use(isPathParamsInHeaderExists$),
  r.useEffect((req$: Observable<ListDirectoryRequest>, ctx) => {
    const fs = useContext(FileSystemToken)(ctx.ask);
    const exchange = useContext(PathExchangeToken)(ctx.ask);

    return req$.pipe(
      mergeMap((req) => {
        const skip = req.query.skip || 0;
        const length = req.query.length || 100;
        const depth = req.query.depth || 5;
        const createdAt = req.query.createdAt && toSort(req.query.createdAt);
        const updatedAt = req.query.updatedAt && toSort(req.query.updatedAt);

        return exchange.directory(req).pipe(
          catchError((err: Error) =>
            throwError(
              () => new HttpError(err.message, HttpStatus.NOT_ACCEPTABLE)
            )
          ),
          mergeMap((path: string) =>
            of(path).pipe(
              mergeMap((path) => fs.exists(path)),
              mergeMap((exists) => {
                return defer(() =>
                  exists
                    ? fs.list(path, {
                        depth,
                        skip,
                        length,
                        createdAt,
                        updatedAt,
                      })
                    : throwError(
                        () => new HttpError('NotFound', HttpStatus.NOT_FOUND)
                      )
                );
              }),
              retryWhen((subj) =>
                subj.pipe(
                  mergeMap((error: HttpError, retryAttempt) => {
                    if (
                      error.status === HttpStatus.NOT_FOUND &&
                      req.headers[OrdoHeaderPath.PATH] === '/' &&
                      !retryAttempt
                    ) {
                      return fs.make(path, true);
                    }
                    return throwError(() => error);
                  })
                )
              ),
              mergeMap((list) => from$(list)),
              reduce((acc, item) => [...acc, item], []),
              map((list) =>
                list
                  .sort(sortByCreatedAt(createdAt))
                  .sort(sortByUpdatedAt(updatedAt))
              ),
              mergeMap((children) =>
                from(fs.stat(path)).pipe(
                  map((stat) => {
                    const directory = makeOrdoDirectory(path)(path, stat, 0);
                    directory.children = children;
                    return directory;
                  })
                )
              )
            )
          )
        );
      }),
      map((body) => ({
        headers: { 'content-type': 'appliction/json' },
        body,
      }))
    );
  })
);
