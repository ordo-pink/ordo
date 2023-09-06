// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Oath } from "@ordo-pink/oath"
import type { UserID, FSID } from "./data.types"
import type { Errors } from "./errors.impl"
import { DataError } from "./errors.types"

export type ContentRepository<T> = {
	read: (createdBy: UserID, fsid: FSID) => Oath<T, (typeof Errors)["DataNotFound"]>
	create: (createdBy: UserID, fsid: FSID) => Oath<"OK", DataError>
	write: (
		createdBy: UserID,
		fsid: FSID,
		content: T,
	) => Oath<number, (typeof Errors)["DataNotFound"]>
	delete: (createdBy: UserID, fsid: FSID) => Oath<"OK", (typeof Errors)["DataNotFound"]>
}
