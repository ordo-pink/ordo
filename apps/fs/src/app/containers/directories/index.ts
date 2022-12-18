import { combineRoutes } from '@marblejs/http';
import {
  createDirectory$,
  listDirectory$,
  moveDirectory$,
  removeDirectory$,
  archiveDirectory$,
} from './effects';

export const directories$ = combineRoutes('/directories', {
  effects: [
    createDirectory$,
    removeDirectory$,
    listDirectory$,
    moveDirectory$,
    archiveDirectory$,
  ],
  middlewares: [],
});
