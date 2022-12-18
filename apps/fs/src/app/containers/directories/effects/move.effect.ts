import {useContext} from '@marblejs/core';
import {HttpError, HttpStatus, r} from '@marblejs/http';
import {defer, forkJoin, Observable, of, throwError} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {MoveDirectoryRequest} from '../types';
import {isPathFromToParamsInHeaderExists$} from '../middlewares';
import {FileSystemToken, PathExchangeToken} from '@ordo-fs/contexts';

export const moveDirectory$ = r.pipe(
  r.matchPath('/'),
  r.matchType('PATCH'),
  r.use(isPathFromToParamsInHeaderExists$),
  r.useEffect((req$: Observable<MoveDirectoryRequest>, ctx) => {
    const fs = useContext(FileSystemToken)(ctx.ask);
    const exchange = useContext(PathExchangeToken)(ctx.ask);

    return req$.pipe(
      switchMap((req) =>
        of(req).pipe(
          mergeMap(exchange.pathFromTo),
          catchError((err: Error) =>
            throwError(
              () => new HttpError(err.message, HttpStatus.NOT_ACCEPTABLE)
            )
          ),
          switchMap(([from, to]) =>
            forkJoin([fs.exists(from), fs.exists(to)]).pipe(
              mergeMap(([exFrom, exTo]) => {
                if (!exFrom) {
                  return throwError(
                    () => new HttpError('NOT_FOUND', HttpStatus.NOT_FOUND)
                  );
                }
                if (exTo) {
                  return throwError(
                    () => new HttpError('CONFLICT', HttpStatus.CONFLICT)
                  );
                }
              }),
              mergeMap(() => fs.isDirectory(from)),
              mergeMap((isdirectory) =>
                defer(() =>
                  isdirectory
                    ? fs
                      .move(from, to)
                      .pipe(
                        catchError((e: Error) =>
                          throwError(
                            () =>
                              new HttpError(
                                'NOT_ACCEPTABLE',
                                HttpStatus.NOT_ACCEPTABLE,
                                [e.message]
                              )
                          )
                        )
                      )
                    : throwError(
                      () =>
                        new HttpError(
                          'NOT_ACCEPTABLE',
                          HttpStatus.NOT_ACCEPTABLE
                        )
                    )
                )
              )
            )
          )
        )
      ),
      map((body) => ({
        status: HttpStatus.OK,
        body,
      }))
    );
  })
);
