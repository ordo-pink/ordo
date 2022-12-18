import { HttpMiddlewareEffect, HttpError, HttpStatus } from '@marblejs/http';
import { OrdoHeaderPath } from '@ordo-fs/domain';
import { Observable, mergeMap, of, throwError } from 'rxjs';
import { DirectoryRequest } from '../types';

export const isPathParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<DirectoryRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.PATH] &&
      req.headers[OrdoHeaderPath.PATH].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );

export const isPathFromToParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<DirectoryRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.PATH_FROM] &&
      req.headers[OrdoHeaderPath.PATH_FROM].toString() !== 'undefined' &&
      req.headers[OrdoHeaderPath.PATH_TO] &&
      req.headers[OrdoHeaderPath.PATH_TO].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );
