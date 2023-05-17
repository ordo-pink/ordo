import { Readable } from "stream"
import {
  Encrypter,
  FileDriver,
  MetadataDriver,
  GlobalStatsDriver,
  UnaryFn,
  UserID,
  UserDriver,
  DirectoryPath,
  FilePath,
} from "@ordo-pink/common-types"
import { DirectoryService, FileService } from "@ordo-pink/fs-entity"
import { Logger } from "@ordo-pink/logger"
import { GlobalStatsService } from "@ordo-pink/stats"
import { UserService } from "@ordo-pink/user"
import cors from "cors"
import express, { RequestHandler } from "express"
import type { JwtPayload } from "jsonwebtoken"
import { USER_ID_PARAM, TOKEN_PARSED_PARAM } from "./constants"

export type Params<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  [USER_ID_PARAM]: UserID
  [TOKEN_PARSED_PARAM]: JwtPayload
  logger: Logger
}

export type DirectoryPathParams = Params<{
  path: DirectoryPath
}>

export type FilePathParams = Params<{
  path: FilePath
}>

export type ExtensionsParams = Params<{
  extension: string
}>

export type FsRequestHandler<T = Params> = UnaryFn<
  {
    fileService: FileService<Readable>
    directoryService: DirectoryService
    userService: UserService
    globalStatsService: GlobalStatsService
    logger: Logger
    encrypters: Encrypter[]
  },
  RequestHandler<T>
>

export type CreateOrdoBackendServerParams = {
  fileDriver: FileDriver<Readable>
  metadataDriver: MetadataDriver
  statsDriver: GlobalStatsDriver
  userDriver: UserDriver
  prependMiddleware?: UnaryFn<ReturnType<typeof express>, ReturnType<typeof express>>
  corsOptions?: Parameters<typeof cors>[0]
  authorise: RequestHandler<Params<Record<string, unknown>>>
  logger: Logger
  encrypters: Encrypter[]
}
