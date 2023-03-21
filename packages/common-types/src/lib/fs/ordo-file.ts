import { NoForbiddenCharacters } from "./common"
import { OrdoDirectoryPath } from "./ordo-directory"
import { UnaryFn } from "../types"

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
 * Disallow having a traling slash in a string.
 */
export type NonTrailingSlash<T> = T extends `${string}/` ? never : T

/**
 * Valid structure of a valid OrdoFile and OrdoFileRaw path.
 */
export type OrdoFilePath = `/${string}${OrdoFileExtension}`

/**
 * Proper OrdoFilePath or never.
 */
export type ValidatedOrdoFilePath<T extends OrdoFilePath> = NonTrailingSlash<T> &
  NonSlash<T> &
  NoForbiddenCharacters<T>

/**
 * Raw OrdoFile content shared between the frontend and the backend.
 */
export interface IOrdoFileRaw {
  /**
   * Path of the file. Must be a valid OrdoFilePath.
   */
  path: OrdoFilePath

  /**
   * Size of the file.
   */
  size: number

  /**
   * Last modified date.
   */
  updatedAt: Date
}

/**
 * OrdoFile to be used in the application.
 */
export type IOrdoFile = {
  /**
   * @see IOrdoFileRaw.path
   */
  path: OrdoFilePath

  /**
   * @see IOrdoFileRaw.size
   */
  size: number

  /**
   * @see IOrdoFileRaw.updatedAt
   */
  updatedAt: Date
  /**
   * Readable name of the file.
   */
  readableName: string

  /**
   * File extension. Must be a valid OrdoFileExtension.
   */
  extension: OrdoFileExtension

  readableSize: string
}

/**
 * Initialisation params for creating an IOrdoFileRaw.
 */
export interface IOrdoFileRawInitParams<Path extends OrdoFilePath> {
  /**
   * @see IOrdoFileRaw.path
   */
  path: ValidatedOrdoFilePath<Path>

  /**
   * @see IOrdoFileRaw.size
   */
  size: number

  /**
   * @see IOrdoFileRaw.updatedAt
   * @optional Equals to new Date() if not specified.
   */
  updatedAt?: Date
}

/**
 * Static methods of an OrdoFile.
 */
export interface IOrdoFileStatic {
  /**
   * Creates an IOrdoFile from an IOrdoFileRaw.
   *
   * @throws TypeError if provided path is invalid.
   */
  of: UnaryFn<IOrdoFileRaw, IOrdoFile>

  /**
   * Creates an empty IOrdoFile with given path.
   *
   * @throws TypeError if provided path is invalid.
   */
  empty: <Path extends OrdoFilePath>(path: ValidatedOrdoFilePath<Path>) => IOrdoFile

  /**
   * Creates an IOrdoFile from IOrdoFileRawInitParams.
   *
   * @throws TypeError if provided path is invalid.
   */
  from: <Path extends OrdoFilePath>(params: IOrdoFileRawInitParams<Path>) => IOrdoFile

  /**
   * Creates an IOrdoFileRaw from IOrdoFileRawInitParams.
   *
   * @throws TypeError if provided path is invalid.
   */
  raw: <Path extends OrdoFilePath>(params: IOrdoFileRawInitParams<Path>) => IOrdoFileRaw

  /**
   * Check if provided path is a valid IOrdoFile path.
   */
  isValidPath: (path: unknown) => path is OrdoFilePath

  /**
   * Check if provided object is an IOrdoFile.
   */
  isOrdoFile: (x: unknown) => x is IOrdoFile

  /**
   * Check if provided object is an IOrdoFileRaw.
   */
  isOrdoFileRaw: (x: unknown) => x is IOrdoFileRaw

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
}
