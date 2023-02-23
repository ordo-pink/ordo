import { bindEagerlyTo } from '@marblejs/core';
import { createServer } from '@marblejs/http';
import { IO } from 'fp-ts/lib/IO';
import { listener } from './app';
import {
  FileSystemContext,
  FileSystemToken,
  PathExchange,
  PathExchangeToken,
} from './contexts';

const server = createServer({
  port: 1337,
  hostname: '127.0.0.1',
  listener,
  dependencies: [
    bindEagerlyTo(FileSystemToken)(FileSystemContext),
    bindEagerlyTo(PathExchangeToken)(PathExchange),
  ],
});

const main: IO<void> = async () => await (await server)();

main();
