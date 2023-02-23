import { HttpStatus } from '@marblejs/http';
import { join } from 'path';
import { OrdoHeaderPath } from '../domain/ordo-incoming.message';
import { Environment } from '../types';

export const environment: Environment = {
  production: false,
  cwd: join(process.cwd(), 'files'),
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT',],
    withCredentials: false,
    optionsSuccessStatus: HttpStatus.NO_CONTENT, // 204
    allowHeaders: [
      ...Object.values(OrdoHeaderPath),
      'authorization',
      'origin',
      'content-type'
    ],
  },
};
