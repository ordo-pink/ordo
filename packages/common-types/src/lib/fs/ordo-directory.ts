import { FSID, NoForbiddenCharacters, NotEndingWithDot, UserID } from "./common"
import { IOrdoFile, OrdoFilePath, ValidatedOrdoFilePath } from "./ordo-file"
import { Nullable, UnaryFn } from "../types"

/**
 * Valid structure of a valid OrdoDirectory and OrdoDirectory path.
 */
export type OrdoDirectoryPath = `/${string}/` | "/"

/**
 * Proper OrdoDirectoryPath or never.
 */
export type ValidatedOrdoDirectoryPath<T extends OrdoDirectoryPath> =
  | (NotEndingWithDot<T> & NoForbiddenCharacters<T>)
  | "/"

/**
 * OrdoDirectory to be used in the application.
 */
export type IOrdoDirectory<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  path: OrdoDirectoryPath
  fsid: FSID
  createdAt: Date
  updatedAt: Date
  createdBy: UserID
  updatedBy: UserID
}

export type IOrdoDirectoryInitParams<Path extends OrdoDirectoryPath> = Partial<IOrdoDirectory> & {
  path: ValidatedOrdoDirectoryPath<Path>
}

/**
 * Static methods of an OrdoDirectory.
 */
export interface IOrdoDirectoryStatic {
  /**
   * Check if provided path is a valid IOrdoDirectory path.
   */
  isValidPath: (path: unknown) => path is OrdoDirectoryPath

  /**
   * Check if provided object is an IOrdoDirectory.
   */
  isOrdoDirectory: (x: unknown) => x is IOrdoDirectory

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
  sort: UnaryFn<(IOrdoDirectory | IOrdoFile)[], (IOrdoDirectory | IOrdoFile)[]>

  findParent: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>,
    drive: (IOrdoDirectory | IOrdoFile)[],
  ) => Nullable<IOrdoDirectory>

  findFileDeep: <Path extends OrdoFilePath>(
    path: ValidatedOrdoFilePath<Path>,
    drive: (IOrdoDirectory | IOrdoFile)[],
  ) => Nullable<IOrdoFile>

  findDirectoryDeep: <Path extends OrdoDirectoryPath>(
    path: ValidatedOrdoDirectoryPath<Path>,
    drive: (IOrdoDirectory | IOrdoFile)[],
  ) => Nullable<IOrdoDirectory>

  getFilesDeep: (directory: IOrdoDirectory, drive: (IOrdoDirectory | IOrdoFile)[]) => IOrdoFile[]

  getDirectoriesDeep: (
    directory: IOrdoDirectory,
    drive: (IOrdoDirectory | IOrdoFile)[],
  ) => IOrdoDirectory[]
}
