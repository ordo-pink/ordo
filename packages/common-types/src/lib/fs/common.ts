import { OrdoDirectoryPath, IOrdoDirectoryRaw, IOrdoDirectory } from "./ordo-directory"
import { OrdoFilePath, IOrdoFileRaw, IOrdoFile } from "./ordo-file"
import { ForbidCharacters, UnaryFn } from "../types"

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

export type ForbiddenPathCharacters = (typeof disallowedCharacters)[number]

export type NoForbiddenCharacters<T extends string> = ForbidCharacters<ForbiddenPathCharacters, T>

export type FSDriver = {
  directories: {
    create: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
    get: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
    set: UnaryFn<IOrdoDirectory, Promise<IOrdoDirectoryRaw>>
    move: UnaryFn<
      { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
      Promise<IOrdoDirectoryRaw>
    >
    remove: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
  }
  files: {
    create: UnaryFn<{ file: IOrdoFile; content: string }, Promise<IOrdoFileRaw | IOrdoDirectoryRaw>>
    get: UnaryFn<OrdoFilePath, Promise<IOrdoFileRaw>>
    set: UnaryFn<IOrdoFile, Promise<IOrdoFileRaw>>
    setContent: UnaryFn<
      { file: IOrdoFile; content: string },
      Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
    >
    getContent: UnaryFn<OrdoFilePath, ReturnType<typeof fetch>>
    move: UnaryFn<
      { oldPath: OrdoFilePath; newPath: OrdoFilePath },
      Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
    >
    remove: UnaryFn<OrdoFilePath, Promise<IOrdoFileRaw>>
  }
}
