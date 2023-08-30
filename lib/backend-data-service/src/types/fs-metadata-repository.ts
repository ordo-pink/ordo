// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Directory, DirectoryPath, File, FilePath } from "@ordo-pink/datautil"
import { Oath } from "@ordo-pink/oath"
import { Nullable, Unary } from "@ordo-pink/tau"
import { SUB } from "@ordo-pink/wjwt"

// --- Public ---

export type MetadataRepository = {
	_internal: {
		createUserSpace: CreateUserSpaceFn
		// removeUserSpace: RemoveUserSpaceFn
	}
	directory: {
		read: DirectoryReadFn
		exists: DirectoryExistsFn
		create: DirectoryCreateFn
		update: DirectoryUpdateFn
		delete: DirectoryDeleteFn
		getRoot: GetRootFn
	}
	file: {
		read: FileReadFn
		exists: FileExistsFn
		create: FileCreateFn
		update: FileUpdateFn
		delete: FileDeleteFn
	}
}

// --- Internal ---

type DirectoryExistsParams = { sub: SUB; path: DirectoryPath }
type DirectoryExistsFn = Unary<DirectoryExistsParams, Oath<boolean>>

type FileExistsParams = { sub: SUB; path: FilePath }
type FileExistsFn = Unary<FileExistsParams, Oath<boolean>>

type DirectoryCreateFn = (params: {
	sub: SUB
	path: DirectoryPath
	directory: Directory
}) => Oath<Directory, Error>

type FileCreateFn = (params: { sub: SUB; path: FilePath; file: File }) => Oath<File, Error>

type DirectoryReadParams = { sub: SUB; path: DirectoryPath }
type DirectoryReadFn = Unary<DirectoryReadParams, Oath<Nullable<Directory>, Error>>

type FileReadParams = { sub: SUB; path: FilePath }
type FileReadFn = Unary<FileReadParams, Oath<Nullable<File>, Error>>

type DirectoryUpdateFn = (params: {
	sub: SUB
	path: DirectoryPath
	directory: Directory
}) => Oath<Nullable<Directory>, Error>

type FileUpdateFn = (params: {
	sub: SUB
	path: FilePath
	file: File
}) => Oath<Nullable<File>, Error>

type DirectoryDeleteParams = { sub: SUB; path: DirectoryPath }
type DirectoryDeleteFn = Unary<DirectoryDeleteParams, Oath<Nullable<Directory>, Error>>

type FileDeleteParams = { sub: SUB; path: FilePath }
type FileDeleteFn = Unary<FileDeleteParams, Oath<Nullable<File>, Error>>

type CreateUserSpaceFn = Unary<Directory, Oath<void, Error>>
type RemoveUserSpaceFn = Unary<SUB, Oath<void, Error>>

type GetRootFn = Unary<SUB, Oath<Nullable<Array<Directory | File>>, Error>>
