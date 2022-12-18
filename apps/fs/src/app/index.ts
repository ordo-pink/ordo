import { combineRoutes, httpListener } from '@marblejs/http';
import { logger$ } from '@marblejs/middleware-logger';
import { files$, directories$ } from './containers';
import { keycloakMiddlware$ } from './middlewares';

const middlewares = [logger$(), keycloakMiddlware$];

const apiRoutes = combineRoutes('/api', [files$, directories$]);

export const listener = httpListener({
  middlewares,
  effects: [apiRoutes],
});
