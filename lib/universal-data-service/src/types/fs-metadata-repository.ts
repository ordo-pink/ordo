// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "#lib/backend-token-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { Nullable, Unary } from "#lib/tau/mod.ts"
import { DirectoryPath, Directory, DirectoryWithChildren } from "./directory.ts"
import { FilePath, File } from "./file.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export type MetadataRepository = {
	directory: {
		read: DirectoryReadFn
		exists: DirectoryExistsFn
		create: DirectoryCreateFn
		update: DirectoryUpdateFn
		delete: DirectoryDeleteFn
		readWithChildren: DirectoryGetWithChildrenFn
	}
	file: {
		read: FileReadFn
		exists: FileExistsFn
		create: FileCreateFn
		update: FileUpdateFn
		delete: FileDeleteFn
	}
}

// INTERNAL ---------------------------------------------------------------------------------------

type DirectoryExistsParams = { sub: SUB; path: DirectoryPath }
type DirectoryExistsFn = Unary<DirectoryExistsParams, Oath<boolean>>

type FileExistsParams = { sub: SUB; path: FilePath }
type FileExistsFn = Unary<FileExistsParams, Oath<boolean>>

type DirectoryCreateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	directory: Directory<T>
}
type DirectoryCreateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: DirectoryCreateParams<T>
) => Oath<Directory, Error>

type FileCreateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	path: FilePath
	content: File<T>
}
type FileCreateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: FileCreateParams<T>
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
	params: DirectoryUpdateParams<T>
) => Oath<Nullable<Directory>, Error>

type FileUpdateParams<T extends Record<string, unknown> = Record<string, unknown>> = {
	sub: SUB
	path: FilePath
	content: File<T>
}
type FileUpdateFn = <T extends Record<string, unknown> = Record<string, unknown>>(
	params: FileUpdateParams<T>
) => Oath<Nullable<File>, Error>

type DirectoryDeleteParams = { sub: SUB; path: DirectoryPath }
type DirectoryDeleteFn = Unary<DirectoryDeleteParams, Oath<Nullable<Directory>, Error>>

type FileDeleteParams = { sub: SUB; path: FilePath }
type FileDeleteFn = Unary<FileDeleteParams, Oath<Nullable<File>, Error>>

type DirectoryGetWithChildrenParams = { sub: SUB; path: DirectoryPath }
type DirectoryGetWithChildrenFn = Unary<
	DirectoryGetWithChildrenParams,
	Oath<Nullable<DirectoryWithChildren>, Error>
>
