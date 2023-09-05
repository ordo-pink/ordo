// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { Unary, Nullable } from "@ordo-pink/tau"
import {
	FilePath,
	CreateFileParams,
	File,
	Directory,
	DirectoryPath,
	CreateDirectoryParams,
	UpdateFileParams,
	UpdateDirectoryParams,
} from "@ordo-pink/data"
import { SUB } from "@ordo-pink/wjwt"

// --- Public ---

export type TDataService<TReadContent, TWriteContent = TReadContent> = {
	// findFiles: FindFilesFn
	// findDirectories: FindDirectoriesFn
	createUserSpace: CreateUserSpaceFn

	getFile: GetFileFn
	checkFileExistsByPath: CheckFileExistsByPathFn
	createFile: CreateFileFn<TWriteContent>
	updateFile: UpdateFileFn
	removeFile: RemoveFileFn
	getFileContent: GetFileContentFn<TReadContent>
	setFileContent: SetFileContentFn<TWriteContent>

	checkDirectoryExists: CheckDirectoryExists
	getRoot: GetRootFn
	getDirectory: FindDirectoryFn
	createDirectory: CreateDirectoryFn
	updateDirectory: UpdateDirectoryFn
	removeDirectory: RemoveDirectoryFn
}

// --- Internal ---

type GetFileParams = { sub: SUB; path: FilePath }
type GetFileFn = Unary<GetFileParams, Oath<Nullable<File>, Error>>

type CreateFileFn<TWriteContent> = Unary<
	{
		sub: SUB
		params: CreateFileParams
		encryption?: string | false
		content?: TWriteContent
	},
	Oath<File, Error>
>

type UpdateFileFn = Unary<
	{ sub: SUB; path: FilePath; params: UpdateFileParams },
	Oath<Nullable<File>, Error>
>

type RemoveFileParams = { sub: SUB; path: FilePath }
type RemoveFileFn = Unary<RemoveFileParams, Oath<Nullable<File>, Error>>

type GetFileContentParams = { sub: SUB; path: FilePath }
type GetFileContentFn<TReadContent> = Unary<
	GetFileContentParams,
	Oath<Nullable<TReadContent>, Error>
>

type SetFileContentParams<TWriteContent> = { sub: SUB; path: FilePath; content: TWriteContent }
type SetFileContentFn<TWriteContent> = Unary<
	SetFileContentParams<TWriteContent>,
	Oath<Nullable<File>, Error>
>

type FindFilesParams = { sub: SUB; filter: Unary<File, boolean> }
type FindFilesFn = Unary<FindFilesParams, Oath<File[], Error>>

type FindDirectoriesParams = { sub: SUB; filter: Unary<File, boolean> }
type FindDirectoriesFn = Unary<FindDirectoriesParams, Oath<Directory[], Error>>

type FindDirectoryByPathParams = { sub: SUB; path: DirectoryPath }
type FindDirectoryFn = Unary<FindDirectoryByPathParams, Oath<Nullable<Directory>, Error>>

type CreateDirectoryFn = Unary<{ sub: SUB; params: CreateDirectoryParams }, Oath<Directory, Error>>

type UpdateDirectoryFn = Unary<
	{
		sub: SUB
		path: DirectoryPath
		params: UpdateDirectoryParams
		upsert?: boolean
	},
	Oath<Nullable<Directory>, Error>
>

type RemoveDirectoryParams = { sub: SUB; path: DirectoryPath }
type RemoveDirectoryFn = Unary<RemoveDirectoryParams, Oath<Nullable<Directory>, Error>>

type CheckFileExistsParams = { sub: SUB; path: FilePath }
type CheckFileExistsFn = Unary<CheckFileExistsParams, Oath<boolean>>

type CheckFileExistsByPathParams = { sub: SUB; path: FilePath }
type CheckFileExistsByPathFn = Unary<CheckFileExistsByPathParams, Oath<boolean>>

type CheckDirectoryExistsParams = { sub: SUB; path: DirectoryPath }
type CheckDirectoryExists = Unary<CheckDirectoryExistsParams, Oath<boolean>>

type CreateUserSpaceFn = Unary<SUB, Oath<void, Error>>

type GetRootFn = Unary<SUB, Oath<Nullable<Array<Directory | File>>, Error>>
