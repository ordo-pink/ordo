/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { RRR, type Rrr, rrr } from "@ordo-pink/sdk-core"
import type { Server } from "@ordo-pink/sdk-server"
import { keys_of } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import type { ReferenceMappingUser } from "./backend-reference-mapping-user.types"

export const create_reference_mapping_user = (
	persistence_strategy_data: Server.Data.PersistenceStrategy,
	persistence_strategy_user: Server.User.PersistenceStrategy,
): Server.User.ReferenceMapping => {
	let storage_p = get_storage_p(persistence_strategy_data)

	const ms0 = oath.from_promise<ReferenceMappingUser.Mapping, never>(() => storage_p)

	return {
		exists_by_email: email => ms0.pipe(oath.ops.map(ms => !!ms.email[email])),

		exists_by_handle: handle => ms0.pipe(oath.ops.map(ms => !!ms.handle[handle])),

		get_by_email: email =>
			ms0.pipe(oath.ops.chain(m => oath.from_nullable(m.email[email], () => rrr.enoent("User not found")))),

		get_by_handle: handle =>
			ms0.pipe(oath.ops.chain(m => oath.from_nullable(m.handle[handle], () => rrr.enoent("User not found", handle)))),

		refresh: id =>
			ms0
				.pipe(
					oath.ops.chain((mapping: ReferenceMappingUser.Mapping) =>
						oath.merge({
							current: {
								email: keys_of(mapping.email).find(key => mapping.email[key] === id),
								handle: keys_of(mapping.handle).find(key => mapping.handle[key] === id),
							},
							mapping,
							user: persistence_strategy_user.read(id).pipe(oath.ops.fix(() => void 0)),
						}),
					),
				)
				.pipe(
					oath.ops.map(({ current, mapping, user }) => {
						if (!user) {
							if (current.email) mapping.email[current.email] = undefined
							if (current.handle) mapping.handle[current.handle] = undefined
						} else {
							const uid = user.get_id()

							mapping.email[user.get_email()] = uid
							mapping.handle[user.get_handle()] = uid
						}

						return mapping
					}),
				)
				.pipe(oath.ops.chain(m => oath.try(() => JSON.stringify(m), to_rrr("Could not save mapping"))))
				.pipe(oath.ops.chain(s => oath.try(() => new Blob([s], { type }).stream(), to_rrr("Could not save mapping"))))
				.pipe(oath.ops.chain(s => persistence_strategy_data.update(SYSTEM_DATA_FSID, USER_MAPPING_FSID, s)))
				.pipe(oath.ops.rmap(e => (e.type === RRR.TYPE.EIO ? e : rrr.eio(e.message, ...(e.debug ?? []))) as Rrr.Instance<"EIO">))
				.pipe(oath.ops.map(() => void (storage_p = get_storage_p(persistence_strategy_data)))),
	}
}

// --- Internal ---

const SYSTEM_DATA_FSID = "5b17a9e5-2655-40b3-8bc7-3a324bbdc792"

const USER_MAPPING_FSID = "5045c1f6-b1ba-4251-b761-7b7f502e7d70"

const type = "application/json"

const to_rrr = (message: string) => (error: unknown) => rrr.eio(message, error)

const get_storage_p = (persistence_strategy_data: Server.Data.PersistenceStrategy) =>
	persistence_strategy_data
		.read(SYSTEM_DATA_FSID, USER_MAPPING_FSID)
		.pipe(
			oath.ops.chain(s =>
				oath
					.from_promise(() => Bun.readableStreamToJSON(s) as Promise<ReferenceMappingUser.Mapping>)
					.pipe(oath.ops.rmap(to_rrr("Could not get user mapping"))),
			),
		)
		.cata(oath.catas.or_else(() => ({ email: {}, handle: {} }) as ReferenceMappingUser.Mapping))
