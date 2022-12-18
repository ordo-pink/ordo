import {HttpRequest} from '@marblejs/http';
import {OrdoIncomingMessage} from '@ordo-fs/domain';

export type GetDirectoryRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type RemoveDirectoryRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type CreateDirectoryRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type ArchiveDirectoryRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type ListDirectoryRequest = HttpRequest<
  never,
  never,
  {
    depth: number;
    length: number;
    skip: number;
    updatedAt: 'ASC' | 'DESC';
    createdAt: 'ASC' | 'DESC';
  }
> &
  OrdoIncomingMessage;

export type MoveDirectoryRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;

export type DirectoryRequest =
  | GetDirectoryRequest
  | RemoveDirectoryRequest
  | CreateDirectoryRequest
  | ListDirectoryRequest
  | MoveDirectoryRequest;
