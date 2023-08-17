// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "#lib/backend-token-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { Unary, Nullable } from "#lib/tau/mod.ts"
import { FSID } from "./file.ts"

// --- Public ---

export type DataRepository<TReadContent, TWriteContent = TReadContent> = {
	exists: FileExistsFn
	create: FileCreateFn
	read: FileReadFn<TReadContent>
	update: FileUpdateFn<TWriteContent>
	delete: FileDeleteFn
}

// --- Internal ---

type FileExistsParams = { sub: SUB; fsid: FSID }
type FileExistsFn = Unary<FileExistsParams, Oath<boolean>>

type FileCreateParams = { sub: SUB; fsid?: FSID }
type FileCreateFn = Unary<FileCreateParams, Oath<FSID, Error>>

type FileReadParams = { sub: SUB; fsid: FSID; encryption?: string | false }
type FileReadFn<TReadContent> = Unary<FileReadParams, Oath<Nullable<TReadContent>, Error>>

type FileUpdateParams<T> = {
	sub: SUB
	fsid: FSID
	content: T
	upsert?: boolean
}
type FileUpdateFn<T> = Unary<FileUpdateParams<T>, Oath<number, Error>>

type FileDeleteParams = { sub: SUB; fsid: FSID }
type FileDeleteFn = Unary<FileDeleteParams, Oath<Nullable<FSID>, Error>>