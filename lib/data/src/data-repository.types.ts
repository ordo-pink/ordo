// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Oath } from "@ordo-pink/oath"
import type { PlainData, UserID } from "./data.types"
import type { Errors } from "./errors.impl"
import type { FSID } from "./data.types"
import { DataError } from "./errors.types"
import { Nullable } from "@ordo-pink/tau"

export type DataRepository = {
	exists: (uid: UserID, fsid: FSID) => Oath<boolean>
	find: (uid: UserID, name: string, parent: Nullable<FSID>) => Oath<PlainData, DataError>
	create: (plain: PlainData) => Oath<PlainData, DataError>
	get: (uid: UserID, fsid: FSID) => Oath<PlainData, DataError>
	getAll: (uid: UserID) => Oath<PlainData[], DataError>
	update: (plain: PlainData) => Oath<"OK", DataError>
	delete: (uid: UserID, fsid: FSID) => Oath<"OK", DataError>
}
