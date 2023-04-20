import { Colour, NoForbiddenCharacters } from "./common"
import { IOrdoFileRaw, IOrdoFile, OrdoFilePath, ValidatedOrdoFilePath } from "./ordo-file"
import { Nullable, UnaryFn } from "../types"

/**
 * A union of possible children of an OrdoDirectoryRaw.
 */
export type OrdoFsEntityRaw = IOrdoFileRaw | IOrdoDirectoryRaw

/**
 * A union of possible children of an OrdoDirectory.
 */
export type OrdoFsEntity = IOrdoFile | IOrdoDirectory

/**
 * Valid structure of a valid OrdoDirectory and OrdoDirectoryRaw path.
 */
export type OrdoDirectoryPath = `/${string}/` | "/"

/**
 * Proper OrdoDirectoryPath or never.
 */
export type ValidatedOrdoDirectoryPath<T extends OrdoDirectoryPath> = NoForbiddenCharacters<T> | "/"

/**
 * These are the default fileds that always exist on a directory.
 */
export type DefaultDirectoryMetadata = {
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: string
  colour?: Colour
  isExpanded?: boolean
  isFavourite?: boolean
  childOrder?: string[]
}

/**
 * Raw OrdoDirectory content shared between the frontend and the backend.
 */
export interface IOrdoDirectoryRaw<T extends Record<string, unknown> = Record<string, unknown>> {
  /**
   * Path of the directory. Must be a valid OrdoDirectoryPath.
   */
  path: OrdoDirectoryPath

  /**
   * Children of the directory.
   */
  children: OrdoFsEntityRaw[]

  /**
   * Meta information about the directory.
   */
  metadata: T & DefaultDirectoryMetadata
}

/**
 * OrdoDirectory to be used in the application.
 */
export type IOrdoDirectory<T extends Record<string, unknown> = Record<string, unknown>> = {
  /**
   * @see IOrdoDirectoryRaw.path
   */
  path: OrdoDirectoryPath

  /**
   * @see IOrdoDirectoryRaw.children
   */
  children: OrdoFsEntity[]

  /**
   * Readable name of the directory.
   */
  readableName: string

  /**
   * @see IOrdoDirectoryRaw.metadata
   */
  metadata: T & DefaultDirectoryMetadata
}

/**
 * Initialisation params for creating an IOrdoDirectoryRaw.
 */
export interface IOrdoDirectoryRawInitParams<Path extends OrdoDirectoryPath> {
  /**
   * @see IOrdoDirectoryRaw.path
   */
  path: ValidatedOrdoDirectoryPath<Path>

  /**
   * @see IOrdoDirectoryRaw.children
   */
  children: OrdoFsEntityRaw[]

  /**
   * @see IOrdoDirectoryRaw.metadata
   */
  metadata?: Record<string, unknown>
}

/**
 * Static methods of an OrdoDirectory.
 */
export interface IOrdoDirectoryStatic {
  /**
   * Creates an IOrdoDirectory from an IOrdoDirectoryRaw.
   *
   * @throws TypeError if provided path is invalid.
   */
  of: UnaryFn<IOrdoDirectoryRaw, IOrdoDirectory>

  /**
   * Creates an empty IOrdoDirectory with given path.
   *
   * @throws TypeError if provided path is invalid.
   */
  empty: <Path extends OrdoDirectoryPath>(path: ValidatedOrdoDirectoryPath<Path>) => IOrdoDirectory

  /**
   * Creates an IOrdoDirectory from IOrdoDirectoryRawInitParams.
   *
   * @throws TypeError if provided path is invalid.
   */
  from: <Path extends OrdoDirectoryPath>(
    params: IOrdoDirectoryRawInitParams<Path>,
  ) => IOrdoDirectory

  /**
   * Creates IOrdoDirectoryRaw from IOrdoDirectoryRawInitParams.
   *
   * @throws TypeError if provided path is invalid.
   */
  raw: <Path extends OrdoDirectoryPath>(
    params: IOrdoDirectoryRawInitParams<Path>,
  ) => IOrdoDirectoryRaw

  /**
   * Check if provided path is a valid IOrdoDirectory path.
   */
  isValidPath: (path: unknown) => path is OrdoDirectoryPath

  /**
   * Check if provided object is an IOrdoDirectory.
   */
  isOrdoDirectory: (x: unknown) => x is IOrdoDirectory

  /**
   * Check if provided object is an IOrdoDirectoryRaw.
   */
  isOrdoDirectoryRaw: (x: unknown) => x is IOrdoDirectoryRaw

  /**
   * Get path of the parent directory of a given directory path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getParentPath: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>,
  ) => OrdoDirectoryPath

  /**
   * Get readable name of a given directory path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getReadableName: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>,
  ) => string

  /**
   * Sort given array of IOrdoDirectory children. This is a mutable operation.
   */
  sort: UnaryFn<IOrdoDirectory["children"], void>

  findParent: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>,
    root: IOrdoDirectory,
  ) => Nullable<IOrdoDirectory>

  findFileDeep: <Path extends OrdoFilePath>(
    path: ValidatedOrdoFilePath<Path>,
    root: IOrdoDirectory,
  ) => Nullable<IOrdoFile>

  findDirectoryDeep: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>,
    root: IOrdoDirectory,
  ) => Nullable<IOrdoDirectory>

  getFilesDeep: (directory: IOrdoDirectory) => IOrdoFile[]

  getDirectoriesDeep: (directory: IOrdoDirectory) => IOrdoDirectory[]

  toArray: (directory: IOrdoDirectory) => (IOrdoDirectory | IOrdoFile)[]
}
