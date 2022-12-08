import { useContext } from '@marblejs/core';
import { HttpError, HttpStatus, r } from '@marblejs/http';
import { defer, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RemoveFileRequest } from '../types';
import { isPathParamsInHeaderExists$ } from '../middlewares';
import { FileSystemToken, PathExchangeToken } from '@ordo-fs/contexts';

export const removeFile$ = r.pipe(
  r.matchPath('/'),
  r.matchType('DELETE'),
  r.use(isPathParamsInHeaderExists$),
  r.useEffect((req$: Observable<RemoveFileRequest>, ctx) => {
    const fs = useContext(FileSystemToken)(ctx.ask);
    const exchange = useContext(PathExchangeToken)(ctx.ask);

    return req$.pipe(
      switchMap((req) =>
        of(req).pipe(
          mergeMap(exchange.file),
          catchError((err: Error) =>
            throwError(
              () => new HttpError(err.message, HttpStatus.NOT_ACCEPTABLE)
            )
          ),
          switchMap((path) =>
            fs
              .exists(path)
              .pipe(
                mergeMap((exists) =>
                  defer(() =>
                    exists
                      ? fs
                          .remove(path, false)
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
                          () => new HttpError('NOT_FOUND', HttpStatus.NOT_FOUND)
                        )
                  )
                )
              )
          )
        )
      ),
      map((body) => ({
        status: HttpStatus.NO_CONTENT,
        body,
      }))
    );
  })
);
