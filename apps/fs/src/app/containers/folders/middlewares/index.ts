import { HttpMiddlewareEffect, HttpError, HttpStatus } from '@marblejs/http';
import { OrdoHeaderPath } from '@ordo-fs/domain';
import { Observable, mergeMap, of, throwError } from 'rxjs';
import { FolderRequest } from '../types';

export const isPathParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<FolderRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.FOLDER] &&
      req.headers[OrdoHeaderPath.FOLDER].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );

export const isPathFromToParamsInHeaderExists$: HttpMiddlewareEffect = (
  req$: Observable<FolderRequest>
) =>
  req$.pipe(
    mergeMap((req) =>
      req.headers[OrdoHeaderPath.FOLDER_FROM] &&
      req.headers[OrdoHeaderPath.FOLDER_FROM].toString() !== 'undefined' &&
      req.headers[OrdoHeaderPath.FOLDER_TO] &&
      req.headers[OrdoHeaderPath.FOLDER_TO].toString() !== 'undefined'
        ? of(req)
        : throwError(() => new HttpError('BadRequest', HttpStatus.BAD_REQUEST))
    )
  );
