import { UnaryFn } from "../../types"
import { endsWithSlash, isValidPath } from "../common"
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

export type OrdoFilePath = `/${string}`

/**
 * Raw OrdoFile content shared between the frontend and the backend.
 */
export interface IOrdoFileRaw {
  /**
   * Path of the file. Must be a valid OrdoFilePath.
   */
  get path(): OrdoFilePath

  /**
   * Size of the file.
   */
  get size(): number

  /**
   * Last modified date.
   */
  get updatedAt(): Date
}

/**
 * OrdoFile to be used in the application.
 */
export type IOrdoFile = {
  /**
   * @see IOrdoFileRaw.path
   */
  get path(): OrdoFilePath

  /**
   * @see IOrdoFileRaw.size
   */
  get size(): number

  /**
   * @see IOrdoFileRaw.updatedAt
   */
  get updatedAt(): Date
  /**
   * Readable name of the file.
   */
  get readableName(): string

  /**
   * File extension. Must be a valid OrdoFileExtension.
   */
  get extension(): OrdoFileExtension
}

/**
 * Initialisation params for creating an IOrdoFileRaw.
 */
export interface IOrdoFileRawInitParams {
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
   */
  of: (raw: IOrdoFileRaw) => IOrdoFile

  /**
   * Creates an IOrdoFile from IOrdoFileRawInitParams.
   */
  from: (params: IOrdoFileRawInitParams) => IOrdoFile

  raw: (params: IOrdoFileRawInitParams) => IOrdoFileRaw

  /**
   * Check if provided path is a valid IOrdoFile path.
   */
  isValidPath: (path: string) => boolean

  /**
   * Check if provided object is an IOrdoFile.
   */
  isOrdoFile: (x: unknown) => x is IOrdoFile

  /**
   * Check if provided object is an IOrdoFileRaw.
   */
  isOrdoFileRaw: (x: unknown) => x is IOrdoFileRaw

  getParentPath: UnaryFn<OrdoFilePath, OrdoDirectoryPath>

  getReadableName: UnaryFn<OrdoFilePath, string>

  getFileExtension: UnaryFn<OrdoFilePath, OrdoFileExtension>

  toFilePath: UnaryFn<string, OrdoFilePath>
}

export const OrdoFile: IOrdoFileStatic = {
  of: (raw) => ordoFile(raw),
  raw: (params) => {
    const path = OrdoFile.toFilePath(params.path)
    const size = params.size
    const updatedAt = params.updatedAt ?? new Date()

    return {
      get path() {
        return path
      },
      get size() {
        return size
      },
      get updatedAt() {
        return updatedAt
      },
    }
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
  isValidPath: (path) => isValidPath(path) && !endsWithSlash(path),
  getParentPath: (path) => {
    const lastSeparatorPosition = path.lastIndexOf("/") + 1

    return path.slice(0, lastSeparatorPosition) as OrdoDirectoryPath
  },
  getReadableName: (path) => {
    const lastSeparatorPosition = path.lastIndexOf("/") + 1
    const readableName = path.slice(lastSeparatorPosition)
    const extension = OrdoFile.getFileExtension(path)

    return readableName.replace(extension, "")
  },
  getFileExtension: (path) => {
    const fileName = path.split("/").reverse()[0] as string

    const lastDotPosition = fileName.lastIndexOf(".")

    if (!~lastDotPosition) {
      return ""
    }

    return fileName.substring(lastDotPosition) as OrdoFileExtension
  },
  toFilePath: (path) => (path.startsWith("/") ? (path as OrdoFilePath) : `/${path}`),
}

export const ordoFile = (raw: IOrdoFileRaw): IOrdoFile => {
  const readableName = OrdoFile.getReadableName(raw.path)
  const extension = OrdoFile.getFileExtension(raw.path)

  return {
    get readableName() {
      return readableName
    },
    get extension() {
      return extension
    },
    get path() {
      return raw.path
    },
    get updatedAt() {
      return raw.updatedAt
    },
    get size() {
      return raw.size
    },
  }
}
