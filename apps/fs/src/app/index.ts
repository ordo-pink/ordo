import { combineRoutes, httpListener } from '@marblejs/http';
import { logger$ } from '@marblejs/middleware-logger';
import { files$, folders$ } from './containers';
import { keycloakMiddlware$ } from './middlewares';

const middlewares = [logger$(), keycloakMiddlware$];

const apiRoutes = combineRoutes('/api', [files$, folders$]);

export const listener = httpListener({
  middlewares,
  effects: [apiRoutes],
});
