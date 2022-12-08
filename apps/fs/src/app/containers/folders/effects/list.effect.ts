import { useContext } from '@marblejs/core';
import { HttpError, HttpStatus, r } from '@marblejs/http';
import { defer, Observable, throwError, from as from$ } from 'rxjs';
import { catchError, map, mergeMap, reduce, switchMap } from 'rxjs/operators';
import { ListFolderRequest } from '../types';
import { isPathParamsInHeaderExists$ } from '../middlewares';
import { sortByCreatedAt, sortByUpdatedAt, toSort } from '@ordo-fs/utils';
import { FileSystemToken, PathExchangeToken } from '@ordo-fs/contexts';

export const listFolder$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.use(isPathParamsInHeaderExists$),
  r.useEffect((req$: Observable<ListFolderRequest>, ctx) => {
    const fs = useContext(FileSystemToken)(ctx.ask);
    const exchange = useContext(PathExchangeToken)(ctx.ask);

    return req$.pipe(
      mergeMap((req) => {
        const skip = req.query.skip || 0;
        const length = req.query.length || 100;
        const depth = req.query.depth || 5;
        const createdAt = req.query.createdAt && toSort(req.query.createdAt);
        const updatedAt = req.query.updatedAt && toSort(req.query.updatedAt);

        return exchange.folder(req).pipe(
          catchError((err: Error) =>
            throwError(
              () => new HttpError(err.message, HttpStatus.NOT_ACCEPTABLE)
            )
          ),
          switchMap((path: string) =>
            fs.exists(path).pipe(
              mergeMap((exists) =>
                defer(() =>
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
                )
              ),
              mergeMap((list) => from$(list)),
              reduce((acc, item) => [...acc, item], []),
              map((list) =>
                list
                  .sort(sortByCreatedAt(createdAt))
                  .sort(sortByUpdatedAt(updatedAt))
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
