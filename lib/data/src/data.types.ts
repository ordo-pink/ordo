// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { TEither } from "@ordo-pink/either"
import type { Nullable } from "@ordo-pink/tau"
import type { Validations } from "./data-validations.types"
import type { Errors } from "./errors.impl"
import type { DataError } from "./errors.types"

/**
 * Unique identifier of an FS entity.
 */
export type FSID = `${string}-${string}-${string}-${string}-${string}`

/**
 * Unique identifier of a user.
 */
export type UserID = `${string}-${string}-${string}-${string}-${string}`

export type PlainData = {
	fsid: FSID
	name: string
	parent: Nullable<FSID>
	children: FSID[]
	links: FSID[]
	labels: string[]
	createdAt: number
	createdBy: UserID
	updatedAt: number
	updatedBy: UserID
	size: number
}

export type TData = {
	plain: PlainData
	setName: (name: string, updatedBy: UserID) => TEither<TData, DataError>
	setSize: (size: number, updatedBy: UserID) => TEither<TData, DataError>
	setParent: (parent: Nullable<FSID>, updatedBy: UserID) => TEither<TData, DataError>
	addChild: (child: FSID, updatedBy: UserID) => TEither<TData, DataError>
	removeChild: (child: FSID, updatedBy: UserID) => TEither<TData, DataError>
	dropChildren: (updatedBy: UserID) => TEither<TData, DataError>
	addLink: (link: FSID, updatedBy: UserID) => TEither<TData, DataError>
	removeLink: (link: FSID, updatedBy: UserID) => TEither<TData, DataError>
	dropLinks: (updatedBy: UserID) => TEither<TData, DataError>
	addLabel: (link: string, updatedBy: UserID) => TEither<TData, DataError>
	removeLabel: (link: string, updatedBy: UserID) => TEither<TData, DataError>
	dropLabels: (updatedBy: UserID) => TEither<TData, DataError>
}

export type DataStatic = {
	Validations: Validations
	Errors: typeof Errors
	of: (plain: PlainData) => TData
	new: (
		params: Pick<PlainData, "name" | "parent" | "createdBy"> & { fsid?: FSID },
	) => TEither<TData, DataError>
}
