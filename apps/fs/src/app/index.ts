import { combineRoutes, httpListener } from '@marblejs/http';
import { logger$ } from '@marblejs/middleware-logger';
import { files$, directories$ } from './containers';
import { keycloakMiddlware$ } from './middlewares';
import { cors$ } from '@marblejs/middleware-cors';
import { environment } from '../environments/environment';
const middlewares = [
  logger$(),
  cors$(environment.cors),
  keycloakMiddlware$,
];

const apiRoutes = combineRoutes('/api', [files$, directories$]);

export const listener = httpListener({
  middlewares,
  effects: [apiRoutes],
});
