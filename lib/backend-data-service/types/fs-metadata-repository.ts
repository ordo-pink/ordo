// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "#lib/backend-token-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { Nullable, Unary } from "#lib/tau/mod.ts"
import { DirectoryPath, Directory } from "../src/types/directory.ts"
import { File, FilePath } from "../src/types/file.ts"

export type FSMetadataRepository = {
	directory: {
		exists: DirectoryExistsFn
		create: DirectoryCreateFn
		read: DirectoryReadFn
		update: DirectoryUpdateFn
		delete: DirectoryDeleteFn
	}
	file: {
		exists: FileExistsFn
		create: FileCreateFn
		read: FileReadFn
		update: FileUpdateFn
		delete: FileDeleteFn
	}
}

type DirectoryExistsParams = { sub: SUB; path: DirectoryPath }
type DirectoryExistsFn = Unary<DirectoryExistsParams, Oath<boolean>>

type FileExistsParams = { sub: SUB; path: FilePath }
type FileExistsFn = Unary<FileExistsParams, Oath<boolean>>

type DirectoryCreateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	path: DirectoryPath
	content: Directory<T>
}
type DirectoryCreateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: DirectoryCreateParams<T>,
) => Oath<Directory, Error>

type FileCreateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	path: FilePath
	content: File<T>
}
type FileCreateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: FileCreateParams<T>,
) => Oath<File, Error>

type DirectoryReadParams = { sub: SUB; path: DirectoryPath; depth?: number }
type DirectoryReadFn = Unary<DirectoryReadParams, Oath<Nullable<Directory>, Error>>

type FileReadParams = { sub: SUB; path: FilePath }
type FileReadFn = Unary<FileReadParams, Oath<Nullable<File>, Error>>

type DirectoryUpdateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	path: DirectoryPath
	content: Directory<T>
}
type DirectoryUpdateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: DirectoryUpdateParams<T>,
) => Oath<Nullable<Directory>, Error>

type FileUpdateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	path: FilePath
	content: File<T>
}
type FileUpdateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: FileUpdateParams<T>,
) => Oath<Nullable<File>, Error>

type DirectoryDeleteParams = { sub: SUB; path: DirectoryPath; depth?: number }
type DirectoryDeleteFn = Unary<DirectoryDeleteParams, Oath<Nullable<Directory>, Error>>

type FileDeleteParams = { sub: SUB; path: FilePath }
type FileDeleteFn = Unary<FileDeleteParams, Oath<Nullable<File>, Error>>
