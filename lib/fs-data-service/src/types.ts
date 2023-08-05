// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "#lib/backend-token-service/mod.ts"

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
 * Valid structure of a Directory path.
 */
export type DirectoryPath = `/${string}/` | "/"

/**
 * Valid structure of a valid OrdoFile and OrdoFile path.
 */
export type FilePath = `/${string}`

/**
 * Unique identifier of a file body.
 */
export type FSID = {
	/**
	 * Identifier of the file owner.
	 */
	oid: `${string}-${string}-${string}-${string}-${string}`

	/**
	 * Identifier of the file body.
	 */
	fid: `${string}-${string}-${string}-${string}-${string}`
}

export type NonEmpty<T extends string> = "" extends T ? never : T
export type StartsWithSlash<T extends string> = T extends `/${string}` ? T : never
export type EndsWithSlash<T extends string> = T extends `${string}/` ? T : never
export type NonSlash<T> = T extends "/" ? never : T
export type NonTrailingSlash<T> = T extends `${string}/` ? never : T

/**
 * Valid DirectoryPath or never.
 */
export type ValidatedDirectoryPath<T extends DirectoryPath> =
	| (NonEmpty<T> & StartsWithSlash<T> & EndsWithSlash<T> & NoForbiddenSymbols<T>)
	| "/"

/**
 * Proper OrdoFilePath or never.
 */
export type ValidatedFilePath<T extends FilePath> = StartsWithSlash<T> &
	NonTrailingSlash<T> &
	NonSlash<T> &
	NoForbiddenSymbols<T>

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
 * Disallows using characters in a provided union of characters in a provided string.
 *
 * @example ForbidCharacters<"*" | "+", "2*2"> -> never
 * @example ForbidCharacters<"*" | "+", "2+2"> -> never
 * @example ForbidCharacters<"*" | "+", "2-2"> -> "2-2"
 */
export type ForbidCharacters<
	Chars extends string,
	Str extends string
> = Str extends `${string}${Chars}${string}` ? never : Str

/**
 * A generic type that forbids including any of the forbidden characters.
 */
export type NoForbiddenSymbols<T extends string> = ForbidCharacters<ForbiddenPathSymbol, T>

/**
 * Initialisation params for creating a Directory.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectoryCreateParams<
	CustomMetadata extends Record<string, unknown> = Record<string, unknown>
> = Partial<Directory<CustomMetadata>> & {
	path: DirectoryPath
}

/**
 * Plain Directory data transfe r object to be exchanged between the client and
 * the server.
 */
export type Directory<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	path: DirectoryPath
	createdAt: Date
	updatedAt: Date
	createdBy: SUB
	updatedBy: SUB
}

export type DirectoryWithChildren<T extends Record<string, unknown> = Record<string, unknown>> =
	Directory<T> & {
		children: Array<DirectoryWithChildren | File>
	}

/**
 * Initialisation params for creating a File.
 */
export type FileCreateParams<
	CustomMetadata extends Record<string, unknown> = Record<string, unknown>
> = Partial<File<CustomMetadata>> & {
	path: FilePath
}

/**
 * Plain File data transfer object to be exchanged between the client and the
 * server.
 */
export type File<CustomMetadata extends Record<string, unknown> = Record<string, unknown>> =
	CustomMetadata & {
		fsid: FSID
		path: FilePath
		size: number
		createdAt: Date
		updatedAt: Date
		createdBy: SUB
		updatedBy: SUB
		encryption: string | false
	}
