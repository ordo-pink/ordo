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

import { current_user, rrr } from "@ordo-pink/core"
import { keys_of, undef } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { type PersistenceStrategyUser } from "./backend-persistence-strategy-user.types"

type Mapping = {
	email: Partial<Record<Ordo.User.Email, Ordo.User.UID>>
	handle: Partial<Record<Ordo.User.Handle, Ordo.User.UID>>
}

export const create_reference_mapping_user = (
	persistence_strategy_data: OrdoBackend.Data.PersistenceStrategy,
	persistence_strategy_user: OrdoBackend.User.PersistenceStrategy,
): OrdoBackend.User.ReferenceMapping => {
	let storage_p = get_storage_p(persistence_strategy_data)

	const ms0 = oath.from_promise<Mapping, never>(() => storage_p)

	return {
		exists_by_email: email => ms0.pipe(oath.ops.map(ms => !!ms.email[email])),

		exists_by_handle: handle => ms0.pipe(oath.ops.map(ms => !!ms.handle[handle])),

		get_by_email: email =>
			ms0.pipe(oath.ops.chain(m => oath.from_nullable(m.email[email], () => rrr.codes.enoent("User not found")))),

		get_by_handle: handle =>
			ms0.pipe(oath.ops.chain(m => oath.from_nullable(m.handle[handle], () => rrr.codes.enoent("User not found", handle)))),

		refresh: id =>
			ms0
				.pipe(
					oath.ops.chain((mapping: Mapping) =>
						oath.merge({
							current: {
								email: keys_of(mapping.email).find(key => mapping.email[key] === id),
								handle: keys_of(mapping.handle).find(key => mapping.handle[key] === id),
							},
							mapping,
							user: persistence_strategy_user.read(id).pipe(oath.ops.fix(undef)),
						}),
					),
				)
				.pipe(
					oath.ops.map(({ current, mapping, user }) => {
						if (!user) {
							if (current.email) mapping.email[current.email] = undefined
							if (current.handle) mapping.handle[current.handle] = undefined
						} else {
							const uid = user.get_uid()

							mapping.email[user.get_email()] = uid
							mapping.handle[user.get_handle()] = uid
						}

						return mapping
					}),
				)
				.pipe(oath.ops.chain(m => oath.try(() => JSON.stringify(m), to_rrr("Could not save mapping"))))
				.pipe(oath.ops.chain(s => oath.try(() => new Blob([s], { type }).stream(), to_rrr("Could not save mapping"))))
				.pipe(oath.ops.chain(s => persistence_strategy_data.update(SYSTEM_DATA_FSID, USER_MAPPING_FSID, s)))
				.pipe(oath.ops.rmap(e => (e.code === rrr.type.EIO ? e : rrr.codes.eio(e.message, ...e.debug)) as Ordo.Rrr<"EIO">))
				.pipe(oath.ops.map(() => void (storage_p = get_storage_p(persistence_strategy_data)))),
	}
}

const get_storage_p = (persistence_strategy_data: OrdoBackend.Data.PersistenceStrategy) =>
	persistence_strategy_data
		.read(SYSTEM_DATA_FSID, USER_MAPPING_FSID)
		.pipe(
			oath.ops.chain(s =>
				oath
					.from_promise(() => Bun.readableStreamToJSON(s) as Promise<Mapping>)
					.pipe(oath.ops.rmap(to_rrr("Could not get user mapping"))),
			),
		)
		.cata(oath.catas.or_else(() => ({ email: {}, handle: {} }) as Mapping))

export const create_persistence_strategy_user: PersistenceStrategyUser = persistence_strategy_data => ({
	create: u =>
		persistence_strategy_data
			.exists(u.get_uid(), USER_FILE_FSID)
			.pipe(oath.ops.chain(e => oath.if(!e, { on_false: () => rrr.codes.eexist("User already exists", u.get_uid()) })))
			.pipe(oath.ops.chain(() => oath.try(() => JSON.stringify(u.to_dto()), to_rrr("Could not create user"))))
			.pipe(oath.ops.chain(s => oath.try(() => new Blob([s], { type }).stream(), to_rrr("Could not create user"))))
			.pipe(oath.ops.chain(stream => persistence_strategy_data.create(u.get_uid(), USER_FILE_FSID, stream)))
			.pipe(oath.ops.map(() => u)),

	exists: id =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(oath.ops.rmap(e => rrr.codes.eio("Could not check user", ...e.debug))),

	read: id =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(oath.ops.chain(e => oath.if(e, { on_false: () => rrr.codes.enoent("User not found", id) })))
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
			.pipe(oath.ops.map(dto => current_user.from_dto(dto))),
	delete: () => oath.reject(rrr.codes.eio("Not implemented")),

	update: (id, u) =>
		persistence_strategy_data
			.exists(id, USER_FILE_FSID)
			.pipe(oath.ops.chain(e => oath.if(e, { on_false: () => rrr.codes.enoent("User not found", id) })))
			.pipe(oath.ops.chain(() => oath.try(() => JSON.stringify(u.to_dto()), to_rrr("Could not save user"))))
			.pipe(oath.ops.chain(s => oath.try(() => new Blob([s], { type }).stream(), to_rrr("Could not save user"))))
			.pipe(oath.ops.chain(s => persistence_strategy_data.update(u.get_uid(), USER_FILE_FSID, s)))
			.pipe(oath.ops.map(() => u)),
})

// --- Internal ---

export const USER_FILE_FSID = "b4645e48-6bc5-4950-89dc-bcf501f21c05"

const SYSTEM_DATA_FSID = "5b17a9e5-2655-40b3-8bc7-3a324bbdc792"

const USER_MAPPING_FSID = "5045c1f6-b1ba-4251-b761-7b7f502e7d70"

const type = "application/json"

const to_rrr = (message: string) => (error: unknown) => rrr.codes.eio(message, error)
