import { Readable } from "stream"
import {
  OrdoFilePath,
  IOrdoFileRaw,
  IOrdoDirectoryRaw,
  OrdoDirectoryPath,
  IOrdoFileRawInitParams,
  UnaryFn,
} from "@ordo-pink/core"
import { RequestHandler } from "express"

import { Logger } from "../types"

export type IOrdoFileModel = {
  exists: UnaryFn<OrdoFilePath, Promise<boolean>>
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
  exists: UnaryFn<OrdoDirectoryPath, Promise<boolean>>
  getDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
  deleteDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
    Promise<IOrdoDirectoryRaw>
  >
  createDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
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
  getFileDescriptor: UnaryFn<OrdoFilePath, Promise<IOrdoFileRawInitParams>>
  moveFile: UnaryFn<{ oldPath: OrdoFilePath; newPath: OrdoFilePath }, Promise<OrdoFilePath>>
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
    Promise<OrdoDirectoryPath>
  >
  updateFile: UnaryFn<{ path: OrdoFilePath; content: Readable }, Promise<OrdoFilePath>>
}

export type FsRequestHandler<T = Record<string, unknown>> = UnaryFn<
  {
    file: IOrdoFileModel
    directory: IOrdoDirectoryModel
    logger: Logger
  },
  RequestHandler<T>
>
