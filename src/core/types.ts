import type { Readable } from "stream"
import type { RequestHandler } from "express"

import type { IEither } from "$core/either"

import type { Exception } from "$fs/constants"

export type OrdoFileExtension = `.${string}` | ""
export type OrdoFilePath = `/${string}`
export type OrdoDirectoryPath = `/${string}/`

export type UserDriver = {
  protect: UnaryFn<string[], RequestHandler>
  authorize: RequestHandler
}

export type FSDriver = {
  createDirectory: UnaryFn<OrdoDirectoryPath, Promise<IEither<OrdoDirectory, Exception.CONFLICT>>>
  getDirectory: UnaryFn<OrdoDirectoryPath, Promise<IEither<OrdoDirectory, Exception.NOT_FOUND>>>
  moveDirectory: BinaryFn<
    OrdoDirectoryPath,
    OrdoDirectoryPath,
    Promise<IEither<OrdoDirectory, Exception.NOT_FOUND | Exception.CONFLICT>>
  >
  removeDirectory: UnaryFn<OrdoDirectoryPath, Promise<IEither<OrdoDirectory, Exception.NOT_FOUND>>>

  createFile: BinaryFn<
    OrdoFilePath,
    Readable,
    Promise<IEither<OrdoFile | OrdoDirectory, Exception.CONFLICT>>
  >
  getFile: UnaryFn<OrdoFilePath, Promise<IEither<Readable, Exception.NOT_FOUND>>>
  updateFile: BinaryFn<OrdoFilePath, Readable, Promise<IEither<OrdoFile, Exception.NOT_FOUND>>>
  moveFile: BinaryFn<
    OrdoFilePath,
    OrdoFilePath,
    Promise<IEither<OrdoFile | OrdoDirectory, Exception.NOT_FOUND | Exception.CONFLICT>>
  >
  removeFile: UnaryFn<OrdoFilePath, Promise<IEither<OrdoFile, Exception.NOT_FOUND>>>
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
  path: OrdoFilePath
  readableName: string
  extension: OrdoFileExtension
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  depth: number
  size: number
  metadata: Metadata
}

export type OrdoDirectory<Metadata extends Record<string, unknown> = Record<string, unknown>> = {
  path: OrdoDirectoryPath
  readableName: string
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  depth: number
  children: Array<OrdoFile | OrdoDirectory>
  metadata: Metadata
}

export type Drivers = {
  fsDriver: FSDriver
  userDriver: UserDriver
}
