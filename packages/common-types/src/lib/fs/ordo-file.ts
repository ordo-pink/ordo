import { FSID, NoForbiddenCharacters, NotEndingWithDot, UserID } from "./common"
import { IOrdoDirectory, OrdoDirectoryPath } from "./ordo-directory"
import { Nullable } from "../types"

/**
 * Files might or might not have a file extension. These are the two possible
 * options.
 *
 * @example `.png`
 * @example `.gitignore`
 * @example ``
 */
export type OrdoFileExtension = `.${string}` | ""

/**
 * Disallow a string to be a slash.
 */
export type NonSlash<T> = T extends "/" ? never : T

/**
 * Disallow having a trailing slash in a string.
 */
export type NonTrailingSlash<T> = T extends `${string}/` ? never : T

/**
 * Valid structure of a valid OrdoFile and OrdoFile path.
 */
export type OrdoFilePath = `/${string}${OrdoFileExtension}`

/**
 * Proper OrdoFilePath or never.
 */
export type ValidatedOrdoFilePath<T extends OrdoFilePath> = NonTrailingSlash<T> &
  NotEndingWithDot<T> &
  NonSlash<T> &
  NoForbiddenCharacters<T>

/**
 * OrdoFile to be used in the application.
 */
export type IOrdoFile<CustomMetadata extends Record<string, unknown> = Record<string, unknown>> =
  CustomMetadata & {
    fsid: FSID
    path: OrdoFilePath
    size: number
    createdAt: Date
    updatedAt: Date
    createdBy: UserID
    updatedBy: UserID
    encryption: string | false
  }

/**
 * Initialisation params for creating an IOrdoFile.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IOrdoFileInitParams<
  Path extends OrdoFilePath = any,
  CustomMetadata extends Record<string, unknown> = Record<string, unknown>,
> = Partial<IOrdoFile<CustomMetadata>> & {
  path: ValidatedOrdoFilePath<Path>
}

/**
 * Static methods of an OrdoFile.
 */
export interface IOrdoFileStatic {
  /**
   * Check if provided path is a valid IOrdoFile path.
   */
  isValidPath: (path: unknown) => path is OrdoFilePath

  /**
   * Check if provided object is an IOrdoFile.
   */
  isOrdoFile: (x: unknown) => x is IOrdoFile

  /**
   * Get path of the parent directory of a given file path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getParentPath: <Path extends OrdoFilePath>(path: ValidatedOrdoFilePath<Path>) => OrdoDirectoryPath

  /**
   * Get readable name of a given file path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getReadableName: <Path extends OrdoFilePath>(path: ValidatedOrdoFilePath<Path>) => string

  /**
   * Get file extension of a given file path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getFileExtension: <Path extends OrdoFilePath>(
    path: ValidatedOrdoFilePath<Path>,
  ) => OrdoFileExtension

  /**
   * Get a metric-prefixed size of a given size.
   *
   * @throws TypeError if provided size is invalid.
   *
   * @example 1024 -> `1KB`
   * @example 3145728 -> `3MB`
   * @example 0 -> `0B`
   */
  getReadableSize: (size: number) => string

  findParent: <Path extends OrdoFilePath>(
    path: ValidatedOrdoFilePath<Path>,
    root: (IOrdoDirectory | IOrdoFile)[],
  ) => Nullable<IOrdoDirectory>
}
