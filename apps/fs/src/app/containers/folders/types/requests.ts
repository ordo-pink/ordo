import { HttpRequest } from '@marblejs/http';
import { OrdoIncomingMessage } from '../../../../domain';

export type GetFolderRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type RemoveFolderRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type CreateFolderRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type ArchiveFolderRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;
export type ListFolderRequest = HttpRequest<
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

export type MoveFolderRequest = HttpRequest<never, never, never> &
  OrdoIncomingMessage;

export type FolderRequest =
  | GetFolderRequest
  | RemoveFolderRequest
  | CreateFolderRequest
  | ListFolderRequest
  | MoveFolderRequest;
