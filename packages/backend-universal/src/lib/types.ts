import { Readable } from "stream"
import express, { RequestHandler } from "express"
import cors from "cors"
import { Logger, UnaryFn } from "@ordo-pink/common-types"
import {
  OrdoDirectoryPath,
  OrdoFilePath,
  ValidatedOrdoFilePath,
  IOrdoFileRawInitParams,
} from "@ordo-pink/fs-entity"
import { Params } from "./fs"

export type CreateOrdoBackendServerParams = {
  fsDriver: FSDriver
  prependMiddleware?: UnaryFn<ReturnType<typeof express>, ReturnType<typeof express>>
  corsOptions?: Parameters<typeof cors>[0]
  authorize: RequestHandler<Params<Record<string, unknown>>>
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
