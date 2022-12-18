import { HttpMiddlewareEffect, HttpError, HttpStatus } from '@marblejs/http';
import { OrdoHeaderPath } from '@ordo-fs/domain';
import { Observable, mergeMap, of, throwError } from 'rxjs';
import { DirectoryRequest } from '../types';

export const isPathParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<DirectoryRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.DIRECTORY] &&
      req.headers[OrdoHeaderPath.DIRECTORY].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );

export const isPathFromToParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<DirectoryRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.DIRECTORY_FROM] &&
      req.headers[OrdoHeaderPath.DIRECTORY_FROM].toString() !== 'undefined' &&
      req.headers[OrdoHeaderPath.DIRECTORY_TO] &&
      req.headers[OrdoHeaderPath.DIRECTORY_TO].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );
