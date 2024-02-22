// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
