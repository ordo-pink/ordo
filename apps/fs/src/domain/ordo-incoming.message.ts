import { IncomingHttpHeaders, IncomingMessage } from 'http';

export enum OrdoHeaderPath {
  DIRECTORY = 'ordo-directory-path',
  DIRECTORY_FROM = 'ordo-directory-path-from',
  DIRECTORY_TO = 'ordo-directory-path-to',
  FILE = 'ordo-file-path',
  FILE_FROM = 'ordo-file-path-from',
  FILE_TO = 'ordo-file-path-to',
}

type OrdoIncomingHttpHeaders = {
  [key in OrdoHeaderPath]: string;
} & IncomingHttpHeaders;

export interface OrdoIncomingMessage extends IncomingMessage {
  headers: OrdoIncomingHttpHeaders;
}
