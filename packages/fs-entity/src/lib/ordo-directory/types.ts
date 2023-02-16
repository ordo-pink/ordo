import { UnaryFn } from "@ordo-pink/common-types"
import { NoForbiddenCharacters } from "../common"
import { IOrdoFileRaw, IOrdoFile } from "../ordo-file/types"

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
export type ValidatedOrdoDirectoryPath<T extends OrdoDirectoryPath> = NoForbiddenCharacters<T>

/**
 * Raw OrdoDirectory content shared between the frontend and the backend.
 */
export interface IOrdoDirectoryRaw {
  /**
   * Path of the directory. Must be a valid OrdoDirectoryPath.
   */
  path: OrdoDirectoryPath

  /**
   * Children of the directory.
   */
  children: OrdoFsEntityRaw[]
}

/**
 * OrdoDirectory to be used in the application.
 */
export type IOrdoDirectory = {
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
    params: IOrdoDirectoryRawInitParams<Path>
  ) => IOrdoDirectory

  /**
   * Creates IOrdoDirectoryRaw from IOrdoDirectoryRawInitParams.
   *
   * @throws TypeError if provided path is invalid.
   */
  raw: <Path extends OrdoDirectoryPath>(
    params: IOrdoDirectoryRawInitParams<Path>
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
    path: ValidatedOrdoDirectoryPath<Path>
  ) => OrdoDirectoryPath

  /**
   * Get readable name of a given directory path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getReadableName: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>
  ) => string

  /**
   * Sort given array of IOrdoDirectory children. This is a mutable operation.
   */
  sort: UnaryFn<IOrdoDirectory["children"], void>
}
