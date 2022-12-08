import { IncomingHttpHeaders, IncomingMessage } from 'http';

export enum OrdoHeaderPath {
  FOLDER = 'ordo-folder-path',
  FOLDER_FROM = 'ordo-folder-path-from',
  FOLDER_TO = 'ordo-folder-path-to',
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
