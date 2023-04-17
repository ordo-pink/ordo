import { Readable, Transform, Writable } from "stream"
import {
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
import { JwtPayload } from "jsonwebtoken"
import {
  USER_ID_PARAM,
  TOKEN_PARSED_PARAM,
  PATH_PARAM,
  OLD_PATH_PARAM,
  NEW_PATH_PARAM,
} from "./fs/constants"

/**
 * Encryption module API.
 */
export type Encrypt = {
  /**
   * Encrypts readable stream.
   */
  encryptStream: UnaryFn<Readable, Transform>

  /**
   * Decrypts readable stream.
   *
   * @param Writable Stream to write decrypted data to.
   * @returns {Transform} Stream containing decypted data.
   */
  decryptStream: UnaryFn<Writable, Transform>
}

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
    encrypt: Encrypt
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
  encrypt: Encrypt
}

export type FSDriver = {
  checkDirectoryExists: UnaryFn<OrdoDirectoryPath, Promise<boolean>>
  checkFileExists: UnaryFn<OrdoFilePath, Promise<boolean>>
  createFile: UnaryFn<{ path: OrdoFilePath; content?: Readable }, Promise<OrdoFilePath>>
  createDirectory: UnaryFn<OrdoDirectoryPath, Promise<OrdoDirectoryPath>>
  deleteFile: UnaryFn<OrdoFilePath, Promise<OrdoFilePath>>
  deleteDirectory: UnaryFn<OrdoDirectoryPath, Promise<OrdoDirectoryPath>>
  getDirectoryChildren: UnaryFn<OrdoDirectoryPath, Promise<Array<OrdoDirectoryPath | OrdoFilePath>>>
  getFile: UnaryFn<OrdoFilePath, Promise<Readable>>
  getFileDescriptor: <Path extends OrdoFilePath>(
    path: ValidatedOrdoFilePath<Path>,
  ) => Promise<IOrdoFileRawInitParams<Path>>
  moveFile: UnaryFn<{ oldPath: OrdoFilePath; newPath: OrdoFilePath }, Promise<OrdoFilePath>>
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
    Promise<OrdoDirectoryPath>
  >
  updateFile: UnaryFn<{ path: OrdoFilePath; content: Readable }, Promise<OrdoFilePath>>
}

export type IOrdoFileModel = {
  checkFileExists: UnaryFn<OrdoFilePath, Promise<boolean>>
  getFileContent: UnaryFn<{ path: OrdoFilePath; issuerId: string }, Promise<Readable>>
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
    { path: OrdoFilePath; content?: Readable; issuerId },
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
