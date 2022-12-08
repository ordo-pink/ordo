import { combineRoutes } from '@marblejs/http';
import {
  getFile$,
  createFile$,
  removeFile$,
  archiveFile$,
  updateFile$,
  moveFile$,
} from './effects';

export const files$ = combineRoutes('/files', {
  effects: [
    getFile$,
    createFile$,
    removeFile$,
    updateFile$,
    archiveFile$,
    moveFile$,
  ],
  middlewares: [],
});
