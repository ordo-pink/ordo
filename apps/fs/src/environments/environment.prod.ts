import { join } from 'path';
import { Environment } from '../types';

export const environment: Environment = {
  production: true,
  cwd: join(process.cwd(), 'files'),
  cors: {},
};
