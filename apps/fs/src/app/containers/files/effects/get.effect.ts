import { useContext } from '@marblejs/core';
import { HttpError, HttpStatus, r } from '@marblejs/http';
import { defer, Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { GetFileRequest } from '../types';
import { lookup } from 'mime-types';
import { isPathParamsInHeaderExists$ } from '../middlewares';
import { FileSystemToken, PathExchangeToken } from '@ordo-fs/contexts';

export const getFile$ = r.pipe(
  r.matchPath('/'),
  r.matchType('GET'),
  r.use(isPathParamsInHeaderExists$),
  r.useEffect((req$: Observable<GetFileRequest>, ctx) => {
    const fs = useContext(FileSystemToken)(ctx.ask);
    const exchange = useContext(PathExchangeToken)(ctx.ask);

    return req$.pipe(
      mergeMap(exchange.file),
      catchError((err: Error) =>
        throwError(() => new HttpError(err.message, HttpStatus.NOT_ACCEPTABLE))
      ),
      switchMap((path: string) =>
        fs.exists(path).pipe(
          mergeMap((exists) =>
            defer(() =>
              exists
                ? fs.read(path)
                : throwError(
                    () => new HttpError('NotFound', HttpStatus.NOT_FOUND)
                  )
            )
          ),
          map((body) => ({
            mimeType: lookup(path) || 'application/octet-stream',
            body,
          }))
        )
      ),
      map(({ mimeType, body }) => ({
        headers: { 'Content-Type': mimeType },
        body,
      }))
    );
  })
);
