import { Readable } from "stream"
import {
  Encrypter,
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  IOrdoFileRawInitParams,
  OrdoDirectoryPath,
  OrdoFilePath,
  UnaryFn,
  ValidatedOrdoFilePath,
} from "@ordo-pink/common-types"
import { IOrdoInternal } from "@ordo-pink/fs-entity"
import { Logger } from "@ordo-pink/logger"
import cors from "cors"
import express, { RequestHandler } from "express"
import type { JwtPayload } from "jsonwebtoken"
import {
  USER_ID_PARAM,
  TOKEN_PARSED_PARAM,
  PATH_PARAM,
  OLD_PATH_PARAM,
  NEW_PATH_PARAM,
} from "./fs/constants"

export type Params<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  [USER_ID_PARAM]: string
  [TOKEN_PARSED_PARAM]: JwtPayload
  logger: Logger
}

export type ParamsWithPath<T extends OrdoDirectoryPath | OrdoFilePath> = Params<{
  [PATH_PARAM]: T
}>

export type ParamsWithOldPathAndNewPath<T extends OrdoDirectoryPath | OrdoFilePath> = Params<{
  [OLD_PATH_PARAM]: T
  [NEW_PATH_PARAM]: T
}>

export type ExtensionsParams = Params<{
  extension: string
}>

export type FsRequestHandler<T = Params> = UnaryFn<
  {
    file: IOrdoFileModel
    directory: IOrdoDirectoryModel
    internal: IOrdoInternalModel
    logger: Logger
    encrypt: Encrypter
  },
  RequestHandler<T>
>

export type OrdoFilePathParams = ParamsWithPath<OrdoFilePath>
export type OrdoFileTwoPathsParams = ParamsWithOldPathAndNewPath<OrdoFilePath>

export type OrdoDirectoryPathParams = ParamsWithPath<OrdoDirectoryPath>
export type OrdoDirectoryTwoPathsParams = ParamsWithOldPathAndNewPath<OrdoDirectoryPath>

export type CreateOrdoBackendServerParams = {
  fsDriver: FSDriver
  prependMiddleware?: UnaryFn<ReturnType<typeof express>, ReturnType<typeof express>>
  corsOptions?: Parameters<typeof cors>[0]
  authorise: RequestHandler<Params<Record<string, unknown>>>
  logger: Logger
  encrypt: Encrypter
}

/**
 * Ordo file system driver.
 */
export type FSDriver = {
  /**
   * Check if a directory exists under given path.
   */
  checkDirectoryExists: UnaryFn<OrdoDirectoryPath, Promise<boolean>>

  /**
   * Check if file exists under given path.
   */
  checkFileExists: UnaryFn<OrdoFilePath, Promise<boolean>>

  /**
   * Create file under given path. If content is provided, populate the file.
   * Rejects if a file already exists under given path.
   */
  createFile: UnaryFn<{ path: OrdoFilePath; content?: Readable }, Promise<OrdoFilePath>>

  /**
   * Create directory under given path.
   */
  createDirectory: UnaryFn<OrdoDirectoryPath, Promise<OrdoDirectoryPath>>

  /**
   * Remove file under given path. Rejects if the file does not exist under
   * given path.
   */
  deleteFile: UnaryFn<OrdoFilePath, Promise<OrdoFilePath>>

  /**
   * Remove directory under given path. Rejects if the directory does not exist
   * under given path.
   */
  deleteDirectory: UnaryFn<OrdoDirectoryPath, Promise<OrdoDirectoryPath>>

  /**
   * Get direct descendants of directory under given path. Rejects if the
   * directory does not exist under given path. Returns an array of file and/or
   * directory paths.
   */
  getDirectoryChildren: UnaryFn<OrdoDirectoryPath, Promise<Array<OrdoDirectoryPath | OrdoFilePath>>>

  /**
   * Get contends of a file under given path. Rejects if the file does not
   * exist under given path.
   */
  getFile: UnaryFn<OrdoFilePath, Promise<Readable>>

  /**
   * Get descriptor of a file under given path. Rejects if the file does not
   * exist under given path.
   */
  getFileDescriptor: <Path extends OrdoFilePath>(
    path: ValidatedOrdoFilePath<Path>,
  ) => Promise<IOrdoFileRawInitParams<Path>>

  /**
   * Moves file from old path to new path. Rejects if old path does not exist.
   * Rejects if a file under new path already exists.
   */
  moveFile: UnaryFn<{ oldPath: OrdoFilePath; newPath: OrdoFilePath }, Promise<OrdoFilePath>>

  /**
   * Moves directory from old path to new path. Rejects if old path does not
   * exist. Rejects if a directory under new path already exists.
   */
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
    Promise<OrdoDirectoryPath>
  >

  /**
   * Updates file under given path with given content. Rejects if a file does
   * not exist under given path.
   */
  updateFile: UnaryFn<{ path: OrdoFilePath; content: Readable }, Promise<OrdoFilePath>>
}

export type IOrdoFileModel = {
  checkFileExists: UnaryFn<OrdoFilePath, Promise<boolean>>
  getMetadata: UnaryFn<{ path: OrdoFilePath; issuerId: string }, Promise<IOrdoFileRaw["metadata"]>>
  setMetadata: UnaryFn<
    { path: OrdoFilePath; issuerId: string; content: IOrdoFileRaw["metadata"] },
    Promise<IOrdoFileRaw["metadata"]>
  >
  getFileContentStream: UnaryFn<{ path: OrdoFilePath; issuerId: string }, Promise<Readable>>
  getFileContentString: UnaryFn<{ path: OrdoFilePath; issuerId: string }, Promise<string>>
  getFile: UnaryFn<{ path: OrdoFilePath; issuerId: string }, Promise<IOrdoFileRaw>>
  updateFile: UnaryFn<
    { path: OrdoFilePath; content: Readable; issuerId: string },
    Promise<IOrdoFileRaw>
  >
  deleteFile: UnaryFn<{ path: OrdoFilePath; issuerId: string }, Promise<IOrdoFileRaw>>
  moveFile: UnaryFn<
    { oldPath: OrdoFilePath; newPath: OrdoFilePath; issuerId: string },
    Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
  >
  createFile: UnaryFn<
    { path: OrdoFilePath; content?: Readable; issuerId: string },
    Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
  >
}

export type IOrdoInternalModel = {
  getInternalValue: <K extends keyof IOrdoInternal>(
    userId: string,
    key: K,
  ) => Promise<IOrdoInternal[K]>
  setInternalValue: <K extends keyof IOrdoInternal>(
    userId: string,
    key: K,
    value: IOrdoInternal[K],
  ) => Promise<void>
  getValues: (userId: string) => Promise<IOrdoInternal>
}

export type IOrdoDirectoryModel = {
  checkDirectoryExists: UnaryFn<OrdoDirectoryPath, Promise<boolean>>
  getDirectory: UnaryFn<{ path: OrdoDirectoryPath; issuerId: string }, Promise<IOrdoDirectoryRaw>>
  deleteDirectory: UnaryFn<
    { path: OrdoDirectoryPath; issuerId: string },
    Promise<IOrdoDirectoryRaw>
  >
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath; issuerId: string },
    Promise<IOrdoDirectoryRaw>
  >
  createDirectory: UnaryFn<
    { path: OrdoDirectoryPath; issuerId: string },
    Promise<IOrdoDirectoryRaw>
  >
}
