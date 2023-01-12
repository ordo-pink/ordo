import type { Request, Response } from "express"

import type { RequestHandler } from "express"

import type { IEither } from "$core/either"

import type { Exception } from "$fs/constants"

export type FileExtension = `.${string}` | ""
export type FilePath = `/${string}`
export type DirectoryPath = `/${string}/`

export type FSDriver = {
  createDirectory: UnaryFn<DirectoryPath, Promise<IEither<OrdoDirectory, Exception.CONFLICT>>>
  getDirectory: UnaryFn<DirectoryPath, Promise<IEither<OrdoDirectory, Exception.NOT_FOUND>>>
  moveDirectory: BinaryFn<
    DirectoryPath,
    DirectoryPath,
    Promise<IEither<OrdoDirectory, Exception.NOT_FOUND | Exception.CONFLICT>>
  >
  removeDirectory: UnaryFn<DirectoryPath, Promise<IEither<OrdoDirectory, Exception.NOT_FOUND>>>

  createFile:
    | UnaryFn<FilePath, Promise<IEither<OrdoFile, Exception.CONFLICT>>>
    | BinaryFn<FilePath, string, Promise<IEither<OrdoFile, Exception.CONFLICT>>>
  getFile: UnaryFn<FilePath, Promise<IEither<OrdoFile, Exception.NOT_FOUND>>>
  updateFile: BinaryFn<FilePath, string, Promise<IEither<OrdoFile, Exception.NOT_FOUND>>>
  moveFile: BinaryFn<
    FilePath,
    FilePath,
    Promise<IEither<OrdoFile, Exception.NOT_FOUND | Exception.CONFLICT>>
  >
  removeFile: UnaryFn<FilePath, Promise<IEither<OrdoFile, Exception.NOT_FOUND>>>
}

export type FsRequestHandler<T = Record<string, unknown>> = UnaryFn<FSDriver, RequestHandler<T>>

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ThunkFn<Result> = () => Result
export type UnaryFn<Arg, Result> = (arg: Arg) => Result
export type BinaryFn<Arg1, Arg2, Result> = (arg1: Arg1, arg2: Arg2) => Result
export type TernaryFn<Arg1, Arg2, Arg3, Result> = (arg1: Arg1, arg2: Arg2, arg3: Arg3) => Result

export type Unpack<T> = T extends Array<infer U> ? U : T

export type OrdoFile<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: FilePath
  readableName: string
  extension: FileExtension
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  depth: number
  size: number
  metadata: Metadata
}

export type OrdoDirectory<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: DirectoryPath
  readableName: string
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  depth: number
  children: Array<OrdoFile | OrdoDirectory>
  metadata: Metadata
}

export type OrdoMiddleware = BinaryFn<Request, Response, void | PromiseLike<void>>

export type Drivers = {
  fsDriver: FSDriver
}
