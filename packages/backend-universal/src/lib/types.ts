import { Readable } from "stream"
import {
  Encrypter,
  FileDriver,
  IOrdoDirectoryModel,
  IOrdoFileModel,
  MetadataDriver,
  OrdoDirectoryPath,
  OrdoFilePath,
  StatsDriver,
  UnaryFn,
} from "@ordo-pink/common-types"
import { Logger } from "@ordo-pink/logger"
import cors from "cors"
import express, { RequestHandler } from "express"
import type { JwtPayload } from "jsonwebtoken"
import { USER_ID_PARAM, TOKEN_PARSED_PARAM } from "./constants"
import { PATH_PARAM, OLD_PATH_PARAM, NEW_PATH_PARAM } from "./fs/constants"

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
    file: IOrdoFileModel<Readable>
    directory: IOrdoDirectoryModel
    logger: Logger
    encrypters: Encrypter[]
  },
  RequestHandler<T>
>

export type OrdoFilePathParams = ParamsWithPath<OrdoFilePath>
export type OrdoFileTwoPathsParams = ParamsWithOldPathAndNewPath<OrdoFilePath>

export type OrdoDirectoryPathParams = ParamsWithPath<OrdoDirectoryPath>
export type OrdoDirectoryTwoPathsParams = ParamsWithOldPathAndNewPath<OrdoDirectoryPath>

export type CreateOrdoBackendServerParams = {
  fileDriver: FileDriver<Readable>
  metadataDriver: MetadataDriver
  statsDriver: StatsDriver
  prependMiddleware?: UnaryFn<ReturnType<typeof express>, ReturnType<typeof express>>
  corsOptions?: Parameters<typeof cors>[0]
  authorise: RequestHandler<Params<Record<string, unknown>>>
  logger: Logger
  encrypters: Encrypter[]
}
