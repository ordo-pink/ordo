import { OrdoDirectoryPath, IOrdoDirectory } from "./ordo-directory"
import { OrdoFilePath, IOrdoFile } from "./ordo-file"
import { BinaryFn, ForbidCharacters, Nullable, UnaryFn } from "../types"

export type FSID = string
export type UserID = `${string}-${string}-${string}`

/**
 * Characters that cannot be used in an Ordo fs path.
 */
export const disallowedCharacters = [
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

export type NonEmpty<T extends string> = "" extends T ? never : T
export type StartsWithSlash<T extends string> = T extends `/${string}` ? T : never
export type EndsWIthSlash<T extends string> = T extends `${string}/` ? T : never
export type NotEndingWithDot<T> = T extends `${string}.` ? never : T

export type ForbiddenPathCharacters = (typeof disallowedCharacters)[number]

export type NoForbiddenCharacters<T extends string> = ForbidCharacters<ForbiddenPathCharacters, T>

export type User = {
  id: UserID
  firstName?: string
  lastName?: string
  username?: string
}

export type FileDriver<Content> = {
  exists: UnaryFn<FSID, Promise<boolean>>
  create: UnaryFn<OrdoFilePath, Promise<FSID>>
  read: UnaryFn<FSID, Promise<Nullable<Content>>>
  update: BinaryFn<FSID, Content, Promise<Nullable<number>>>
  delete: UnaryFn<FSID, Promise<Nullable<FSID>>>
}

export type StatsDriver = {
  fileCreated: (userId: UserID, file: IOrdoFile) => Promise<void>
  fileRemoved: (userId: UserID, file: IOrdoFile) => Promise<void>
  fileUpdated: (userId: UserID, oldFile: IOrdoFile, newFile: IOrdoFile) => Promise<void>
  fileFetched: (userId: UserID, file: IOrdoFile) => Promise<void>
  fileContentUpdated: (userId: UserID, file: IOrdoFile) => Promise<void>
  fileContentFetched: (userId: UserID, file: IOrdoFile) => Promise<void>
  directoryCreated: (userId: UserID, directory: IOrdoDirectory) => Promise<void>
  directoryUpdated: (
    userId: UserID,
    oldDirectory: IOrdoDirectory,
    newDirectory: IOrdoDirectory,
  ) => Promise<void>
  directoryRemoved: (userId: UserID, directory: IOrdoDirectory) => Promise<void>
  directoryFetched: (userId: UserID, directory: IOrdoDirectory) => Promise<void>
}

export type UserDriver = {
  get: UnaryFn<UserID, Promise<User>>
}

export type MetadataDriver = {
  checkDirectoryExists: UnaryFn<OrdoDirectoryPath, Promise<boolean>>
  checkFileExists: UnaryFn<OrdoFilePath, Promise<boolean>>
  createDirectory: UnaryFn<IOrdoDirectory, Promise<Nullable<IOrdoDirectory>>>
  createFile: UnaryFn<IOrdoFile, Promise<IOrdoFile>>
  readDirectory: UnaryFn<OrdoDirectoryPath, Promise<Nullable<IOrdoDirectory>>>
  readFile: UnaryFn<OrdoFilePath, Promise<Nullable<IOrdoFile>>>
  updateDirectory: BinaryFn<OrdoDirectoryPath, IOrdoDirectory, Promise<Nullable<IOrdoDirectory>>>
  updateFile: BinaryFn<OrdoFilePath, IOrdoFile, Promise<Nullable<IOrdoFile>>>
  deleteDirectory: UnaryFn<OrdoDirectoryPath, Promise<Nullable<IOrdoDirectory>>>
  deleteFile: UnaryFn<OrdoFilePath, Promise<Nullable<IOrdoFile>>>
}

export const Colours = [
  "neutral",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
] as const

export type Colour = (typeof Colours)[number]
