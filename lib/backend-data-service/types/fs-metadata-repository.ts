// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "@ordo-pink/wjwt"
import {
	CreateDirectoryParams,
	CreateFileParams,
	Directory,
	DirectoryPath,
	File,
	FilePath,
	UpdateDirectoryParams,
	UpdateFileParams,
} from "@ordo-pink/datautil"
import { Oath } from "@ordo-pink/oath"
import { Nullable, Unary } from "@ordo-pink/tau"

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

type DirectoryCreateFn = (params: CreateDirectoryParams) => Oath<Directory, Error>
type FileCreateFn = (params: CreateFileParams) => Oath<File, Error>

type DirectoryReadParams = { sub: SUB; path: DirectoryPath; depth?: number }
type DirectoryReadFn = Unary<DirectoryReadParams, Oath<Nullable<Directory>, Error>>

type FileReadParams = { sub: SUB; path: FilePath }
type FileReadFn = Unary<FileReadParams, Oath<Nullable<File>, Error>>

type DirectoryUpdateFn = (params: UpdateDirectoryParams) => Oath<Nullable<Directory>, Error>
type FileUpdateFn = (params: UpdateFileParams) => Oath<Nullable<File>, Error>

type DirectoryDeleteParams = { sub: SUB; path: DirectoryPath; depth?: number }
type DirectoryDeleteFn = Unary<DirectoryDeleteParams, Oath<Nullable<Directory>, Error>>

type FileDeleteParams = { sub: SUB; path: FilePath }
type FileDeleteFn = Unary<FileDeleteParams, Oath<Nullable<File>, Error>>
