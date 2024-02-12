// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { TEither } from "@ordo-pink/either"

import type { DataError } from "./errors.types"
import type { Errors } from "./errors.impl"
import type { Validations } from "./data-validations.types"

/**
 * Unique identifier of an FS entity.
 */
export type FSID = `${string}-${string}-${string}-${string}-${string}`

/**
 * Unique identifier of a user.
 */
export type UserID = `${string}-${string}-${string}-${string}-${string}`

export type PlainData<Properties extends Record<string, unknown> = Record<string, unknown>> = {
	fsid: FSID
	name: string
	parent: FSID | null
	links: FSID[]
	labels: string[]
	contentType: string
	createdAt: number
	createdBy: UserID
	updatedAt: number
	updatedBy: UserID
	size: number
	properties?: Properties
}

export type PlainDataWith<Properties extends Record<string, unknown> = Record<string, unknown>> =
	PlainData<Partial<Properties>>

export type TData<Properties extends Record<string, unknown> = Record<string, unknown>> = {
	plain: PlainData<Properties>
	setName: (name: string, updatedBy: UserID) => TEither<TData<Properties>, DataError>
	setSize: (size: number, updatedBy: UserID) => TEither<TData<Properties>, DataError>
	setParent: (parent: FSID | null, updatedBy: UserID) => TEither<TData<Properties>, DataError>
	addLink: (link: FSID, updatedBy: UserID) => TEither<TData<Properties>, DataError>
	removeLink: (link: FSID, updatedBy: UserID) => TEither<TData<Properties>, DataError>
	dropLinks: (updatedBy: UserID) => TEither<TData<Properties>, DataError>
	addLabel: (label: string | string[], updatedBy: UserID) => TEither<TData<Properties>, DataError>
	removeLabel: (
		label: string | string[],
		updatedBy: UserID,
	) => TEither<TData<Properties>, DataError>
	dropLabels: (updatedBy: UserID) => TEither<TData<Properties>, DataError>
	setProperty: <K extends string, V>(
		key: K,
		value: V,
		updatedBy: UserID,
	) => TEither<TData<Record<K, V>>, DataError>
	update: (plain: PlainData) => TEither<TData<Properties>, DataError>
}

export type DataStatic = {
	Validations: Validations
	Errors: typeof Errors
	of: (plain: PlainData) => TData
	as: <Properties extends Record<string, unknown> = Record<string, unknown>>(
		plain: PlainData,
	) => PlainDataWith<Properties>
	new: (
		params: Pick<PlainData, "name" | "parent" | "createdBy" | "properties"> & {
			fsid?: FSID
			labels?: string[]
			contentType?: string
		},
	) => TEither<TData, DataError>
}
