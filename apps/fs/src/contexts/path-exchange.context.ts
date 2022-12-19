import { createContextToken, createReader } from '@marblejs/core';
import { HttpRequest } from '@marblejs/http';
import { getUserId } from '@ordo/utils';
import { dirname, join } from 'path';
import { Observable, of, throwError } from 'rxjs';
import { OrdoHeaderPath, OrdoIncomingMessage } from '../domain';
import { environment } from '../environments/environment';

export type PathExchangeInterface = {
  directory: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string>;
  file: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string>;
  pathFromTo: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => Observable<string[]>;
  getRootPath: <T extends HttpRequest & OrdoIncomingMessage>(
    req: T
  ) => string;
};

export const PathExchange = createReader((): PathExchangeInterface => {

  return {
    getRootPath(req) {
      return join(environment.cwd, getUserId(req.headers.authorization))
    },
    directory(req) {
      const path = req.headers[OrdoHeaderPath.PATH];
      const base = this.getRootPath(req);
      const current = join(base, path);

      if (!~current.indexOf(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      return of(current);
    },
    file(req) {
      const path = req.headers[OrdoHeaderPath.PATH];
      const base = this.getRootPath(req);
      const current = join(base, path);

      if (!~current.indexOf(base) || dirname(current) == dirname(base)) {
        return throwError(() => new Error('[FS] Permission Denied'));
      }
      return of(current);
    },
    pathFromTo(req) {
      const left = req.headers[OrdoHeaderPath.PATH_FROM];
      const right = req.headers[OrdoHeaderPath.PATH_TO];

      const base = this.getRootPath(req);
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
