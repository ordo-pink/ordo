// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "@ordo-pink/backend-token-service/mod.ts"
import { Oath } from "@ordo-pink/oath/mod.ts"
import { Unary, Nullable } from "@ordo-pink/tau/mod.ts"
import { FilePath, FileCreateParams, File } from "./file.ts"
import {
	Directory,
	DirectoryPath,
	DirectoryWithChildren,
	DirectoryCreateParams,
} from "./directory.ts"

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
	getDirectoryChildren: GetDirectoryWithChildrenFn
	createDirectory: CreateDirectoryFn
	updateDirectory: UpdateDirectoryFn
	removeDirectory: RemoveDirectoryFn
}

// --- Internal ---

type GetFileParams = { sub: SUB; path: FilePath }
type GetFileFn = Unary<GetFileParams, Oath<Nullable<File>, Error>>

type CreateFileParams<TWriteContent> = {
	sub: SUB
	file: FileCreateParams
	encryption?: string | false
	content?: TWriteContent
}
type CreateFileFn<TWriteContent> = Unary<CreateFileParams<TWriteContent>, Oath<File, Error>>

type UpdateFileParams = { sub: SUB; path: FilePath; file: File }
type UpdateFileFn = Unary<UpdateFileParams, Oath<Nullable<File>, Error>>

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

type GetDirectoryWithChildrenParams = { sub: SUB; path: DirectoryPath }
type GetDirectoryWithChildrenFn = Unary<
	GetDirectoryWithChildrenParams,
	Oath<Nullable<DirectoryWithChildren>, Error>
>

type CreateDirectoryParams = { sub: SUB; directory: DirectoryCreateParams }
type CreateDirectoryFn = Unary<CreateDirectoryParams, Oath<Directory, Error>>

type UpdateDirectoryParams = {
	sub: SUB
	path: DirectoryPath
	content: Directory
	upsert?: boolean
}
type UpdateDirectoryFn = Unary<UpdateDirectoryParams, Oath<Nullable<Directory>, Error>>

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
