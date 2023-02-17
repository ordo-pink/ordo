import { Readable } from "stream"
import { UnaryFn } from "@ordo-pink/common-types"
import {
  OrdoDirectoryPath,
  OrdoFilePath,
  ValidatedOrdoFilePath,
  IOrdoFileRawInitParams,
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
} from "@ordo-pink/fs-entity"
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

export type Params<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  [USER_ID_PARAM]: string
  [TOKEN_PARSED_PARAM]: JwtPayload
  logger: Logger
}

export type PathParams<T extends OrdoDirectoryPath | OrdoFilePath> = Params<{
  [PATH_PARAM]: T
}>

export type TwoPathsParams<T extends OrdoDirectoryPath | OrdoFilePath> = Params<{
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
    logger: Logger
  },
  RequestHandler<T>
>

export type OrdoFilePathParams = PathParams<OrdoFilePath>
export type OrdoFileTwoPathsParams = TwoPathsParams<OrdoFilePath>

export type OrdoDirectoryPathParams = PathParams<OrdoDirectoryPath>
export type OrdoDirectoryTwoPathsParams = TwoPathsParams<OrdoDirectoryPath>

export type CreateOrdoBackendServerParams = {
  fsDriver: FSDriver
  prependMiddleware?: UnaryFn<ReturnType<typeof express>, ReturnType<typeof express>>
  corsOptions?: Parameters<typeof cors>[0]
  authorise: RequestHandler<Params<Record<string, unknown>>>
  logger: Logger
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
  getFileContent: UnaryFn<OrdoFilePath, Promise<Readable>>
  getFile: UnaryFn<OrdoFilePath, Promise<IOrdoFileRaw>>
  updateFile: UnaryFn<{ path: OrdoFilePath; content: Readable }, Promise<IOrdoFileRaw>>
  deleteFile: UnaryFn<OrdoFilePath, Promise<IOrdoFileRaw>>
  moveFile: UnaryFn<
    { oldPath: OrdoFilePath; newPath: OrdoFilePath },
    Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
  >
  createFile: UnaryFn<
    { path: OrdoFilePath; content?: Readable },
    Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
  >
}

export type IOrdoDirectoryModel = {
  getDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
  deleteDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
    Promise<IOrdoDirectoryRaw>
  >
  createDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
}
