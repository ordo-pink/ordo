import { createContextToken, createReader } from '@marblejs/core';
import { HttpRequest } from '@marblejs/http';
import { getUserId } from '@ordo/utils';
import { dirname, join } from 'path';
import { Observable, of, throwError } from 'rxjs';
import { OrdoHeaderPath, OrdoIncomingMessage } from '../domain';
import { environment } from '../environments/environment';

export type PathExchangeInterface = {
  file: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string>;
  directory: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string>;
  directoryFromTo: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string[]>;
  fileFromTo: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string[]>;
};

export const PathExchange = createReader((): PathExchangeInterface => {
  const getRootPath = (authorization: string) =>
    join(environment.cwd, getUserId(authorization));
  return {
    file(req) {
      const path = req.headers[OrdoHeaderPath.FILE];
      const base = getRootPath(req.headers.authorization);
      const current = join(base, path);

      if (!~current.indexOf(base) || dirname(current) == dirname(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      return of(current);
    },
    directory(req) {
      const path = req.headers[OrdoHeaderPath.DIRECTORY];
      const base = getRootPath(req.headers.authorization);
      const current = join(base, path);

      if (!~current.indexOf(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      return of(current);
    },
    directoryFromTo(req) {
      const left = req.headers[OrdoHeaderPath.DIRECTORY_FROM];
      const right = req.headers[OrdoHeaderPath.DIRECTORY_TO];

      const base = getRootPath(req.headers.authorization);
      const from = join(base, left);

      if (!~from.indexOf(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      const to = join(base, right);

      if (!~to.indexOf(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      return of([from, to]);
    },
    fileFromTo(req) {
      const left = req.headers[OrdoHeaderPath.FILE_FROM];
      const right = req.headers[OrdoHeaderPath.FILE_TO];

      const base = getRootPath(req.headers.authorization);
      const from = join(base, left);

      if (!~from.indexOf(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      const to = join(base, right);

      if (!~to.indexOf(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      return of([from, to]);
    },
  };
});

export type PathExchangeContext = ReturnType<typeof PathExchange>;

export const PathExchangeToken = createContextToken<PathExchangeInterface>(
  'PathExchangeInterface'
);
