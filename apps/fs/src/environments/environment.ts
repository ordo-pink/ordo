import { HttpStatus } from '@marblejs/http';
import { join } from 'path';
import { Environment } from '../types';

export const environment: Environment = {
  production: false,
  cwd: join(process.cwd(), 'files'),
  cors: {
    origin: '*',
    methods: ['*'],
    withCredentials: false,
    optionsSuccessStatus: HttpStatus.NO_CONTENT, // 204
  },
};
