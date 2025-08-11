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

import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { type Server, server } from "@ordo-pink/sdk-server"
import { oath } from "@ordo-pink/oss-oath"

import type * as Lib from "./b-repository-user-repository-data.types"

// TODO Error handling

export const create: Lib.Create = (repository, uid, fid, ufid) => {
	let cache = get_cache_promise(repository, uid, fid)
	const cache0 = oath.from_promise<Lib.Cache, never>(() => cache)

	const read: Lib.Instance["read"] = id =>
		repository.read(id, ufid).pipe(oath.ops.chain(from_stream0(() => core.rrr.eio("Cound not read user", id))))

	const update_cache0 = (current_cache: Lib.Cache) =>
		oath
			.try(() => JSON.stringify(current_cache))
			.pipe(oath.ops.chain(to_stream0()))
			.pipe(oath.ops.chain(s => repository.update(uid, fid, s)))
			.pipe(oath.ops.tap(() => (cache = get_cache_promise(repository, uid, fid))))

	return {
		create: user =>
			oath
				.try(() => JSON.stringify(user), to_rrr("Could not create user"))
				.pipe(oath.ops.chain(to_stream0(to_rrr("Could not create user"))))
				.pipe(oath.ops.chain(stream => repository.create(user[0], ufid, stream)))
				.pipe(
					oath.ops.tap(() => {
						cache0
							.pipe(
								oath.ops.map(cache => {
									cache.ref[user[1]] = user[0]
									cache.email[user[6]] = user[0]

									return cache
								}),
							)
							.pipe(oath.ops.chain(update_cache0))
							.cata(oath.catas.to_promise())
							.catch(() => {
								// TODO tmp persistence
								core.logger.stout.panic("Cache update failed!!!")
								console.dir(cache)
								process.exit(1)
							})
					}),
				)
				.pipe(oath.ops.map(() => user)),

		read,

		delete: repository.delete,

		update: (id, new_user) =>
			read(id).pipe(
				oath.ops.chain(old_user =>
					oath
						.try(() => JSON.stringify(new_user), to_rrr("Could not save user"))
						.pipe(oath.ops.chain(to_stream0(to_rrr("Could not save user"))))
						.pipe(oath.ops.chain(s => repository.update(id, ufid, s)))
						.pipe(
							oath.ops.tap(() => {
								if (new_user[1] === old_user[1] && new_user[6] === old_user[6]) return

								cache0
									.pipe(
										oath.ops.map(cache => {
											if (new_user[1] !== old_user[1]) {
												cache.ref[old_user[1]] = undefined
												cache.ref[new_user[1]] = id
											}

											if (new_user[6] !== old_user[6]) {
												cache.email[old_user[6]] = undefined
												cache.email[new_user[6]] = id
											}

											return cache
										}),
									)
									.pipe(oath.ops.chain(update_cache0))
									.cata(oath.catas.to_promise())
									.catch(() => {
										// TODO tmp persistence
										core.logger.stout.panic("Cache update failed!!!")
										console.dir(cache)
										process.exit(1)
									})
							}),
						)
						.pipe(oath.ops.map(() => new_user)),
				),
			),
		get_by_email: email =>
			cache0
				.pipe(oath.ops.chain(m => oath.from_nullable(m.email[email])))
				.pipe(oath.ops.rmap(() => core.rrr.enoent(CORE.RRR.REASON.NO, server.user.obfuscate_email(email))))
				.pipe(oath.ops.chain(read)),

		get_by_ref: ref =>
			cache0
				.pipe(oath.ops.chain(m => oath.from_nullable(m.ref[ref])))
				.pipe(oath.ops.rmap(() => core.rrr.enoent(CORE.RRR.REASON.NO, ref)))
				.pipe(oath.ops.chain(read)),
	}
}

// --- Internal ---

const to_rrr = (message: string) => (error: unknown) => core.rrr.eio(message, error)

// --- Internal ---

const get_cache_promise = (repository: Server.Data.Repository, uid: Core.User.Id, fid: Core.Data.Id) =>
	repository
		.read(uid, fid)
		.pipe(oath.ops.chain(stream => oath.from_promise(() => Bun.readableStreamToJSON(stream) as Promise<Lib.Cache>)))
		.cata(oath.catas.or_else(() => ({ email: {}, ref: {} }) as Lib.Cache))

const to_stream0 =
	<$F>(on_error: (e: unknown) => $F = e => e as any) =>
	(x: string) =>
		oath.try(() => new Blob([x], { type: "application/json" }).stream(), on_error)

const from_stream0 =
	<$T, $F = unknown>(on_error: (e: unknown) => $F) =>
	(stream: ReadableStream) =>
		oath.from_promise<$T>(() => Bun.readableStreamToJSON(stream)).pipe(oath.ops.rmap(on_error))
