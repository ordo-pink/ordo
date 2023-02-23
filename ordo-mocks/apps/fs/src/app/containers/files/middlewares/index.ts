import {HttpMiddlewareEffect, HttpError, HttpStatus} from '@marblejs/http';
import {OrdoHeaderPath} from '@ordo-fs/domain';
import {Observable, mergeMap, of, throwError} from 'rxjs';
import {FileRequest} from '../types';

export const isPathParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<FileRequest>
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
  req$: Observable<FileRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.PATH_FROM] &&
      req.headers[OrdoHeaderPath.PATH_TO].toString() !== 'undefined' &&
      req.headers[OrdoHeaderPath.PATH_TO] &&
      req.headers[OrdoHeaderPath.PATH_TO].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );
