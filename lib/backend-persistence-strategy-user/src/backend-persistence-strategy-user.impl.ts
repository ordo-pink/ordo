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

import { type User, rrr, user } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oath"

import { type PersistenceStrategyUser } from "./backend-persistence-strategy-user.types"

export const create_persistence_strategy_user: PersistenceStrategyUser = persistence_strategy_data => ({
	create: u =>
		persistence_strategy_data
			.exists(u.get_id(), USER_FILE_FSID)
			.pipe(oath.ops.chain(e => oath.if(!e, { on_false: () => rrr.eexist("User already exists", u.get_id()) })))
			.pipe(oath.ops.chain(() => oath.try(() => JSON.stringify(u.to_dto()), to_rrr("Could not create user"))))
			.pipe(oath.ops.chain(s => oath.try(() => new Blob([s], { type }).stream(), to_rrr("Could not create user"))))
			.pipe(oath.ops.chain(stream => persistence_strategy_data.create(u.get_id(), USER_FILE_FSID, stream)))
			.pipe(oath.ops.map(() => u)),

	exists: id =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(oath.ops.rmap(e => rrr.eio("Could not check user", ...(e.debug ?? [])))),

	read: id =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(oath.ops.chain(e => oath.if(e, { on_false: () => rrr.enoent("User not found", id) })))
			.pipe(
				oath.ops.chain(() =>
					persistence_strategy_data.read(id, USER_FILE_FSID).pipe(oath.ops.rmap(to_rrr("Could not get user"))),
				),
			)
			.pipe(
				oath.ops.chain(s =>
					oath.from_promise(() => Bun.readableStreamToJSON(s)).pipe(oath.ops.rmap(to_rrr("Could not get user"))),
				),
			)
			.pipe(
				oath.ops.chain(dto =>
					oath.if(user.current.validations.is_dto(dto), {
						on_true: () => dto as User.Current.DTO,
						on_false: () => rrr.eio("Could not get user"),
					}),
				),
			)
			.pipe(oath.ops.map(dto => user.current.from_dto(...dto))),

	delete: () => oath.reject(rrr.eio("Not implemented")),

	update: (id, u) =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(oath.ops.chain(e => oath.if(e, { on_false: () => rrr.enoent("User not found", id) })))
			.pipe(oath.ops.chain(() => oath.try(() => JSON.stringify(u.to_dto()), to_rrr("Could not save user"))))
			.pipe(oath.ops.chain(s => oath.try(() => new Blob([s], { type }).stream(), to_rrr("Could not save user"))))
			.pipe(oath.ops.chain(s => persistence_strategy_data.update(u.get_id(), USER_FILE_FSID, s)))
			.pipe(oath.ops.map(() => u)),
})

// --- Internal ---

export const USER_FILE_FSID = "b4645e48-6bc5-4950-89dc-bcf501f21c05"

const type = "application/json"

const to_rrr = (message: string) => (error: unknown) => rrr.eio(message, error)
