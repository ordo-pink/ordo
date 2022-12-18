import {useContext} from '@marblejs/core';
import {HttpError, HttpStatus, r} from '@marblejs/http';
import {defer, Observable, of, throwError} from 'rxjs';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {CreateDirectoryRequest} from '../types';
import {isPathParamsInHeaderExists$} from '../middlewares';
import {FileSystemToken, PathExchangeToken} from '@ordo-fs/contexts';

export const createDirectory$ = r.pipe(
  r.matchPath('/'),
  r.matchType('POST'),
  r.use(isPathParamsInHeaderExists$),
  r.useEffect((req$: Observable<CreateDirectoryRequest>, ctx) => {
    const fs = useContext(FileSystemToken)(ctx.ask);
    const exchange = useContext(PathExchangeToken)(ctx.ask);

    return req$.pipe(
      switchMap((req) =>
        of(req).pipe(
          mergeMap(exchange.directory),
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
                      ? throwError(
                        () => new HttpError('CONFLICT', HttpStatus.CONFLICT)
                      )
                      : fs.make(path, true)
                  )
                )
              )
          )
        )
      ),
      map((body) => ({
        status: HttpStatus.CREATED,
        body,
      }))
    );
  })
);
