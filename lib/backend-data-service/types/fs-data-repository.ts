// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "@ordo-pink/backend-token-service/mod.ts"
import { Oath } from "@ordo-pink/oath/mod.ts"
import { Unary, Nullable } from "@ordo-pink/tau/mod.ts"
import { FilePath, FSID } from "../src/types/file.ts"

export type FSDataRepository<TReadContent, TWriteContent = TReadContent> = {
	exists: FileExistsFn
	create: FileCreateFn<TWriteContent>
	read: FileReadFn<TReadContent>
	update: FileUpdateFn<TWriteContent>
	delete: FileDeleteFn
}

type FileExistsParams = { sub: SUB; fsid: FSID }
type FileExistsFn = Unary<FileExistsParams, Oath<boolean>>

type FileCreateParams<TWriteContent> = {
	sub: SUB
	path: FilePath
	encryption?: string | false
	content?: TWriteContent
}
type FileCreateFn<TWriteContent> = Unary<FileCreateParams<TWriteContent>, Oath<FSID, Error>>

type FileReadParams = { sub: SUB; fsid: FSID; encryption?: string | false }
type FileReadFn<TReadContent> = Unary<FileReadParams, Oath<Nullable<TReadContent>, Error>>

type FileUpdateParams<T> = { sub: SUB; fsid: FSID; encryption?: string | false; content: T }
type FileUpdateFn<T> = Unary<FileUpdateParams<T>, Oath<FSID, Error>>

type FileDeleteParams = { sub: SUB; fsid: FSID }
type FileDeleteFn = Unary<FileDeleteParams, Oath<Nullable<FSID>, Error>>
