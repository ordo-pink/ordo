import { HttpMiddlewareEffect, HttpError, HttpStatus } from '@marblejs/http';
import { isAuthorized$ } from '@ordo-fs/utils';
import { Observable, mergeMap, of, throwError, catchError, iif } from 'rxjs';
import { FileRequest } from '../containers/files/types';
import { FolderRequest } from '../containers/folders/types';

export const keycloakMiddlware$: HttpMiddlewareEffect = (
  req$: Observable<FolderRequest | FileRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      of(req.headers?.authorization).pipe(
        mergeMap((authorization) => isAuthorized$(authorization)),
        catchError((err) =>
          throwError(
            () => new HttpError('Unauthorized', HttpStatus.UNAUTHORIZED, err)
          )
        ),
        mergeMap((authorized) =>
          iif(
            () => authorized,
            of(req),
            throwError(
              () => new HttpError('Unauthorized', HttpStatus.UNAUTHORIZED)
            )
          )
        )
      )
    )
  );
