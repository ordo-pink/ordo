import { BinaryFn, Nullable, TernaryFn, QuadrinomialFn, UnaryFn } from "./types"
import { UserID } from "./user"

/**
 * Valid structure of a Directory path.
 */
export type DirectoryPath = `/${string}/` | "/"

/**
 * Unique identifier of a file body.
 */
export type FSID = string

export type NonEmpty<T extends string> = "" extends T ? never : T
export type StartsWithSlash<T extends string> = T extends `/${string}` ? T : never
export type EndsWIthSlash<T extends string> = T extends `${string}/` ? T : never
export type NotEndingWithDot<T> = T extends `${string}.` ? never : T

/**
 * Disallows using characters in a provided union of characters in a provided string.
 *
 * @example ForbidCharacters<"*" | "+", "2*2"> -> never
 * @example ForbidCharacters<"*" | "+", "2+2"> -> never
 * @example ForbidCharacters<"*" | "+", "2-2"> -> "2-2"
 */
export type ForbidCharacters<
  Chars extends string,
  Str extends string,
> = Str extends `${string}${Chars}${string}` ? never : Str

/**
 * Characters that cannot be used in FS path.
 */
export const FORBIDDEN_PATH_SYMBOLS = [
  "<",
  ">",
  ":",
  '"',
  "\\",
  "|",
  "?",
  "*",
  "..",
  "./",
  "//",
] as const

/**
 * Union type of all forbidden characters in FS path.
 */
export type ForbiddenPathSymbol = (typeof FORBIDDEN_PATH_SYMBOLS)[number]

/**
 * A generic type that forbids including any of the forbidden characters.
 */
export type NoForbiddenSymbols<T extends string> = ForbidCharacters<ForbiddenPathSymbol, T>

/**
 * Valid DirectoryPath or never.
 */
export type ValidatedDirectoryPath<T extends DirectoryPath> =
  | (NotEndingWithDot<T> & NoForbiddenSymbols<T>)
  | "/"

/**
 * Initialisation params for creating a Directory.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectoryCreateParams<Path extends DirectoryPath = any> = Partial<DirectoryDTO> & {
  path: ValidatedDirectoryPath<Path>
}

/**
 * Plain Directory data transfer object to be exchanged between the client and
 * the server.
 */
export type DirectoryDTO<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  path: DirectoryPath
  createdAt: Date
  updatedAt: Date
  createdBy: UserID
  updatedBy: UserID
}

/**
 * Files might or might not have a file extension. These are the two possible
 * options.
 *
 * @example `.png`
 * @example `.gitignore`
 * @example ``
 */
export type FileExtension = `.${string}` | ""

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
export type FilePath = `/${string}${FileExtension}`

/**
 * Proper OrdoFilePath or never.
 */
export type ValidatedFilePath<T extends FilePath> = NonTrailingSlash<T> &
  NotEndingWithDot<T> &
  NonSlash<T> &
  NoForbiddenSymbols<T>

/**
 * Initialisation params for creating a File.
 */
export type FileCreateParams<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Path extends FilePath = any,
  CustomMetadata extends Record<string, unknown> = Record<string, unknown>,
> = Partial<FileDTO<CustomMetadata>> & {
  path: ValidatedFilePath<Path>
}

/**
 * Plain File data transfer object to be exchanged between the client and the
 * server.
 */
export type FileDTO<CustomMetadata extends Record<string, unknown> = Record<string, unknown>> =
  CustomMetadata & {
    fsid: FSID
    path: FilePath
    size: number
    createdAt: Date
    updatedAt: Date
    createdBy: UserID
    updatedBy: UserID
    encryption: string | false
  }

/**
 * File storage driver. This driver is only used for storing file bodies.
 */
export type FileDriver<Content> = {
  exists: BinaryFn<UserID, FSID, Promise<boolean>>
  create: TernaryFn<UserID, FilePath, string | false, Promise<FSID>>
  read: TernaryFn<UserID, FSID, string | false, Promise<Nullable<Content>>>
  update: QuadrinomialFn<UserID, FSID, Content, string | false, Promise<Nullable<number>>>
  delete: BinaryFn<UserID, FSID, Promise<Nullable<FSID>>>
}

/**
 * File and directory metadata driver.
 */
export type MetadataDriver = {
  checkDirectoryExists: BinaryFn<UserID, DirectoryPath, Promise<boolean>>
  checkFileExists: BinaryFn<UserID, FilePath, Promise<boolean>>
  createDirectory: BinaryFn<UserID, DirectoryDTO, Promise<DirectoryDTO>>
  createFile: BinaryFn<UserID, FileDTO, Promise<FileDTO>>
  getDirectory: BinaryFn<UserID, DirectoryPath, Promise<Nullable<DirectoryDTO>>>
  getDirectoryChildren: BinaryFn<UserID, DirectoryPath, Promise<(DirectoryDTO | FileDTO)[]>>
  getFile: BinaryFn<UserID, FilePath, Promise<Nullable<FileDTO>>>
  updateDirectory: TernaryFn<UserID, DirectoryPath, DirectoryDTO, Promise<Nullable<DirectoryDTO>>>
  updateFile: TernaryFn<UserID, FilePath, FileDTO, Promise<Nullable<FileDTO>>>
  removeDirectory: BinaryFn<UserID, DirectoryPath, Promise<Nullable<DirectoryDTO>>>
  removeFile: BinaryFn<UserID, FilePath, Promise<Nullable<FileDTO>>>
  getTotalSize: UnaryFn<UserID, Promise<number>>
}
