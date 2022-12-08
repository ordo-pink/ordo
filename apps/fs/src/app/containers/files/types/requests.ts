import { HttpRequest } from '@marblejs/http';
import { OrdoIncomingMessage } from '../../../../domain';

export type GetFileRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type RemoveFileRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type ArchiveFileRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type MoveFileRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type CreateFileRequest = HttpRequest<ReadableStream, never, never> &
  OrdoIncomingMessage;
export type UpdateFileRequest = HttpRequest<ReadableStream, never, never> &
  OrdoIncomingMessage;

export type FileRequest =
  | GetFileRequest
  | RemoveFileRequest
  | CreateFileRequest
  | ArchiveFileRequest
  | MoveFileRequest
  | UpdateFileRequest;
