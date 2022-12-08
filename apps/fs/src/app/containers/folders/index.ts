import { combineRoutes } from '@marblejs/http';
import {
  createFolder$,
  listFolder$,
  moveFolder$,
  removeForlder$,
  archiveFolder$,
} from './effects';

export const folders$ = combineRoutes('/folders', {
  effects: [
    createFolder$,
    removeForlder$,
    listFolder$,
    moveFolder$,
    archiveFolder$,
  ],
  middlewares: [],
});
