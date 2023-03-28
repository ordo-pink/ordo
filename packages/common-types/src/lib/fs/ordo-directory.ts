import { NoForbiddenCharacters } from "./common"
import { IOrdoFileRaw, IOrdoFile, OrdoFilePath, ValidatedOrdoFilePath } from "./ordo-file"
import { Nullable, ThunkFn, UnaryFn } from "../types"

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
  metadata: T
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
  metadata: T

  /**
   * Returns an array of all elements of the directory including the
   * descendants of nested directories.
   */
  toArray: ThunkFn<Array<IOrdoDirectory | IOrdoFile>>

  /**
   * Returns all files contained in the directory including files in the child
   * directories.
   */
  getFilesDeep: ThunkFn<IOrdoFile[]>

  /**
   * Returns all directories contained in the directory including directories
   * in the child directories.
   */
  getDirectoriesDeep: ThunkFn<IOrdoDirectory[]>

  /**
   * Returns a direct descendant directory of current directory with given
   * path.
   */
  findDirectory: UnaryFn<OrdoDirectoryPath, Nullable<IOrdoDirectory>>

  /**
   * Returns a nested descendant directory of current directory with given
   * path.
   */
  findDirectoryDeep: UnaryFn<OrdoDirectoryPath, Nullable<IOrdoDirectory>>

  /**
   * Returns a direct descendant file of current directory with given path.
   */
  findFile: UnaryFn<OrdoFilePath, Nullable<IOrdoFile>>

  /**
   * Returns a nested descendant file of current directory with given path.
   */
  findFileDeep: UnaryFn<OrdoFilePath, Nullable<IOrdoFile>>
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
}
