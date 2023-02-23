import { IncomingHttpHeaders, IncomingMessage } from 'http';

export enum OrdoHeaderPath {
  PATH = 'ordo-path',
  PATH_FROM = 'ordo-path-from',
  PATH_TO = 'ordo-path-to',
}

type OrdoIncomingHttpHeaders = {
  [key in OrdoHeaderPath]: string;
} & IncomingHttpHeaders;

export interface OrdoIncomingMessage extends IncomingMessage {
  headers: OrdoIncomingHttpHeaders;
}
