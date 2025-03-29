/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Oath, ops0 } from "@ordo-pink/oath"
import { BackendUser } from "@ordo-pink/backend"
import { RRR } from "@ordo-pink/core"

import { type PersistenceStrategyUser } from "./backend-persistence-strategy-user.types"

export const persistence_strategy_user: PersistenceStrategyUser = persistence_strategy_data => ({
	create: u =>
		persistence_strategy_data
			.exists(u.get_uid(), USER_FILE_FSID)
			.pipe(ops0.chain(e => Oath.If(!e, { F: () => RRR.codes.eexist("User already exists", u.get_uid()) })))
			.pipe(ops0.chain(() => Oath.Try(() => JSON.stringify(u.to_dto()), e_to_rrr("Could not create user"))))
			.pipe(ops0.chain(s => Oath.Try(() => new Blob([s], { type }).stream(), e_to_rrr("Could not create user"))))
			.pipe(ops0.chain(stream => persistence_strategy_data.create(u.get_uid(), USER_FILE_FSID, stream)))
			.pipe(ops0.map(() => u)),

	exists: id =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(ops0.rejected_map(rrr => RRR.codes.eio("Could not check user", ...rrr.debug))),

	read: id =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(ops0.chain(e => Oath.If(e, { F: () => RRR.codes.enoent("User not found", id) })))
			.pipe(ops0.chain(() => persistence_strategy_data.read(id, USER_FILE_FSID)))
			.pipe(ops0.chain(s => Oath.Try(() => Bun.readableStreamToJSON(s), e_to_rrr("Could not get user"))))
			.pipe(ops0.map(dto => BackendUser.from_dto(dto))),

	delete: () => Oath.Reject(RRR.codes.eio("Not implemented")),

	update: (id, u) =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(ops0.chain(e => Oath.If(e, { F: () => RRR.codes.enoent("User not found", id) })))
			.pipe(ops0.chain(() => Oath.Try(() => JSON.stringify(u.to_dto()), e_to_rrr("Could not save user"))))
			.pipe(ops0.chain(s => Oath.Try(() => new Blob([s], { type }).stream(), e_to_rrr("Could not save user"))))
			.pipe(ops0.chain(s => persistence_strategy_data.update(u.get_uid(), USER_FILE_FSID, s)))
			.pipe(ops0.map(() => u)),
})

// --- Internal ---

export const USER_FILE_FSID = "b4645e48-6bc5-4950-89dc-bcf501f21c05"

const type = "application/json"

const e_to_rrr = (message: string) => (error: Error) => RRR.codes.eio(message, error)
