import { Readable } from "stream"
import { RequestHandler } from "express"
import { Logger, UnaryFn } from "../types"

export type OrdoFileExtension = `.${string}` | ""
export type OrdoFilePath = `/${string}`
export type OrdoDirectoryPath = `/${string}/`

export type OrdoFileOrDirectory = IOrdoFile | IOrdoDirectory

export type IOrdoFileInitProps = {
  path: OrdoFilePath
  size: number
  updatedAt?: Date
}

export type IOrdoDirectoryInitProps = {
  path: OrdoDirectoryPath
  children: OrdoFileOrDirectory[]
}

export type IOrdoFile = {
  path: OrdoFilePath
  readableName: string
  extension: OrdoFileExtension
  updatedAt: Date
  size: number
}

export type IOrdoDirectory = {
  path: OrdoDirectoryPath
  readableName: string
  children: Array<IOrdoFile | IOrdoDirectory>
}

export type IOrdoFileModel = {
  exists: UnaryFn<OrdoFilePath, Promise<boolean>>
  getFileContent: UnaryFn<OrdoFilePath, Promise<Readable>>
  getFile: UnaryFn<OrdoFilePath, Promise<IOrdoFile>>
  updateFile: UnaryFn<{ path: OrdoFilePath; content: Readable }, Promise<IOrdoFile>>
  deleteFile: UnaryFn<OrdoFilePath, Promise<IOrdoFile>>
  moveFile: UnaryFn<
    { oldPath: OrdoFilePath; newPath: OrdoFilePath },
    Promise<IOrdoFile | IOrdoDirectory>
  >
  createFile: UnaryFn<
    { path: OrdoFilePath; content?: Readable },
    Promise<IOrdoFile | IOrdoDirectory>
  >
}

export type IOrdoDirectoryModel = {
  exists: UnaryFn<OrdoDirectoryPath, Promise<boolean>>
  getDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectory>>
  deleteDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectory>>
  moveDirectory: UnaryFn<
    { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
    Promise<IOrdoDirectory>
  >
  createDirectory: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectory>>
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
  getFileDescriptor: UnaryFn<OrdoFilePath, Promise<IOrdoFileInitProps>>
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
