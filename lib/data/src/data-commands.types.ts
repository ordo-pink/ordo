// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Oath } from "@ordo-pink/oath"
import type { Nullable } from "@ordo-pink/tau"
import type { FSID } from "./common"
import type { PlainData } from "./data.types"
import type { DataError } from "./errors.types"
import type { DataRepository } from "./data-repository.types"
import type { ContentRepository } from "./content-repository.types"

export type TDataCommands<T> = {
	dataRepository: DataRepository
	contentRepository: ContentRepository<T>
	create: (
		params: Pick<PlainData, "name" | "parent" | "createdBy" | "updatedBy"> & { fsid?: FSID },
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
	updateContent: (
		params: Pick<PlainData, "createdBy" | "updatedBy" | "fsid"> & { content: T },
	) => Oath<"OK", DataError>
	uploadContent: (
		params: Pick<PlainData, "createdBy" | "updatedBy" | "name" | "parent"> & { content: T },
	) => Oath<"OK", DataError>
	getContent: (params: Pick<PlainData, "fsid" | "createdBy">) => Oath<T, DataError>
	fetch: (params: Pick<PlainData, "createdBy">) => Oath<PlainData[], DataError>
}
