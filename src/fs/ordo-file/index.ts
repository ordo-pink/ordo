import { UnaryFn } from "../../types"
import { endsWithSlash, isValidPath, NoDisallowedCharacters } from "../common"
import { OrdoDirectoryPath } from "../ordo-directory"

/**
 * Files might or might not have a file extension. These are the two possible
 * options.
 *
 * @example `.png`
 * @example `.gitignore`
 * @example ``
 */
export type OrdoFileExtension = `.${string}` | ""

export type NonSlash<T> = T extends "/" ? never : T

export type NonTrailingSlash<T> = T extends `${string}/` ? never : T

export type OrdoFilePath = `/${string}${OrdoFileExtension}`

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
}

/**
 * Initialisation params for creating an IOrdoFileRaw.
 */
export interface IOrdoFileRawInitParams<Path extends OrdoFilePath> {
  /**
   * @see IOrdoFileRaw.path
   */
  path: NonSlash<NonTrailingSlash<NoDisallowedCharacters<Path>>>

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
  of: (raw: IOrdoFileRaw) => IOrdoFile

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
  getParentPath: UnaryFn<OrdoFilePath, OrdoDirectoryPath>

  /**
   * Get readable name of a given file path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getReadableName: UnaryFn<OrdoFilePath, string>

  /**
   * Get file extension of a given file path.
   *
   * @throws TypeError if provided path is invalid.
   */
  getFileExtension: UnaryFn<OrdoFilePath, OrdoFileExtension>
}

export const OrdoFile: IOrdoFileStatic = {
  of: (raw) => ordoFile(raw),
  raw: (params) => {
    if (!OrdoFile.isValidPath(params.path)) {
      throw new TypeError("Invalid path")
    }

    const path = params.path
    const size = params.size
    const updatedAt = params.updatedAt ? new Date(params.updatedAt) : new Date()

    return { path, size, updatedAt }
  },
  from: (params) => OrdoFile.of(OrdoFile.raw(params)),
  isOrdoFile: (x): x is IOrdoFile =>
    Boolean(x) &&
    typeof (x as IOrdoFile).readableName === "string" &&
    typeof (x as IOrdoFile).extension === "string" &&
    OrdoFile.isOrdoFileRaw(x),
  isOrdoFileRaw: (x): x is IOrdoFileRaw =>
    Boolean(x) &&
    typeof (x as IOrdoFileRaw).size === "number" &&
    typeof (x as IOrdoFileRaw).path === "string" &&
    OrdoFile.isValidPath((x as IOrdoFileRaw).path),
  isValidPath: (path): path is OrdoFilePath =>
    typeof path === "string" && isValidPath(path) && !endsWithSlash(path),
  getParentPath: (path) => {
    if (!OrdoFile.isValidPath(path)) {
      throw new TypeError("Invalid path")
    }

    const lastSeparatorPosition = path.lastIndexOf("/") + 1

    return path.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  getReadableName: (path) => {
    if (!OrdoFile.isValidPath(path)) {
      throw new TypeError("Invalid path")
    }

    const lastSeparatorPosition = path.lastIndexOf("/") + 1
    const readableName = path.slice(lastSeparatorPosition)
    const extension = OrdoFile.getFileExtension(path)

    return readableName.replace(extension, "")
  },
  getFileExtension: (path) => {
    if (!OrdoFile.isValidPath(path)) {
      throw new TypeError("Invalid path")
    }

    const fileName = path.split("/").reverse()[0] as string

    const lastDotPosition = fileName.lastIndexOf(".")

    if (!~lastDotPosition) {
      return ""
    }

    return fileName.substring(lastDotPosition) as OrdoFileExtension
  },
}

export const ordoFile = (raw: IOrdoFileRaw): IOrdoFile => {
  if (!OrdoFile.isValidPath(raw.path)) {
    throw new TypeError("Invalid path")
  }

  const { path, size, updatedAt } = raw

  const readableName = OrdoFile.getReadableName(raw.path)
  const extension = OrdoFile.getFileExtension(raw.path)

  return { readableName, extension, path, updatedAt: new Date(updatedAt), size }
}
