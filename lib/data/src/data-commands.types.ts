// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Oath } from "@ordo-pink/oath"
import type { FSID, PlainData } from "./data.types"
import type { DataError } from "./errors.types"
import type { DataPersistenceStrategy } from "./data-persistence-strategy.types"
import type { ContentPersistenceStrategy } from "./content-persistence-strategy.types"

export type TDataCommands<T> = {
	dataPersistenceStrategy: DataPersistenceStrategy
	contentPersistenceStrategy: ContentPersistenceStrategy<T>
	create: (
		params: Pick<PlainData, "name" | "parent" | "createdBy"> & {
			fsid?: FSID
			fileLimit: number
			labels?: string[]
			contentType?: string
		},
	) => Oath<PlainData, DataError>
	remove: (params: Pick<PlainData, "fsid" | "createdBy">) => Oath<"OK", DataError>
	move: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy" | "parent">,
	) => Oath<"OK", DataError>
	rename: (
		params: Pick<PlainData, "fsid" | "name" | "createdBy" | "updatedBy">,
	) => Oath<"OK", DataError>
	link: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { link: FSID },
	) => Oath<"OK", DataError>
	unlink: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { link: FSID },
	) => Oath<"OK", DataError>
	addLabel: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { label: string | string[] },
	) => Oath<"OK", DataError>
	removeLabel: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { label: string },
	) => Oath<"OK", DataError>
	addLink: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { link: FSID },
	) => Oath<"OK", DataError>
	removeLink: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { link: FSID },
	) => Oath<"OK", DataError>
	update: (
		params: Pick<PlainData, "fsid" | "createdBy" | "updatedBy"> & { data: PlainData },
	) => Oath<"OK", DataError>
	updateContent: (
		params: Pick<PlainData, "createdBy" | "updatedBy" | "fsid"> & {
			content: T
			length: number
			contentType?: string
		},
	) => Oath<number, DataError>
	uploadContent: (
		params: Pick<PlainData, "createdBy" | "updatedBy" | "name" | "parent"> & {
			content: T
			contentType?: string
			fileLimit: number
			length: number
		},
	) => Oath<"OK", DataError>
	getContent: (params: Pick<PlainData, "fsid" | "createdBy">) => Oath<T, DataError>
	fetch: (params: Pick<PlainData, "createdBy">) => Oath<PlainData[], DataError>
}
