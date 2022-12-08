import { HttpMiddlewareEffect, HttpError, HttpStatus } from '@marblejs/http';
import { OrdoHeaderPath } from '../../../../domain';
import { Observable, mergeMap, of, throwError } from 'rxjs';
import { FileRequest } from '../types';

export const isPathParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<FileRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.FILE] &&
      req.headers[OrdoHeaderPath.FILE].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );

export const isPathFromToParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<FileRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.FILE_FROM] &&
      req.headers[OrdoHeaderPath.FILE_TO].toString() !== 'undefined' &&
      req.headers[OrdoHeaderPath.FILE_TO] &&
      req.headers[OrdoHeaderPath.FILE_TO].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );
