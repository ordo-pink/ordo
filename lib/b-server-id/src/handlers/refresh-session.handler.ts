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

import { CORE, core } from "@ordo-pink/sdk-core"
import { type Server, server } from "@ordo-pink/sdk-server"
import type { Wjwt } from "@ordo-pink/oss-wjwt"
import { oath } from "@ordo-pink/oss-oath"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "../b-server-id.types"
import * as id_common from "../common"

export const refresh_session: Lib.Handler = ({ env, request }) =>
	id_common
		.check_user_is_authenticated(request, env)
		.pipe(oath.ops.chain(() => server_routary.oaths.get_auth_cookie(request)))
		.pipe(
			oath.ops.chain(token =>
				oath
					.from_promise(() => env.wjwt.verify(token))
					.pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.INVALID_SERVICE_INITIALIZATION)))
					.pipe(
						oath.ops.chain(is_valid =>
							oath
								.if(is_valid, {
									t: () => env.wjwt.decode(token as Wjwt.TokenString),
									f: core.rrr.eio(CORE.RRR.REASON.INVALID_SERVICE_INITIALIZATION),
								})
								.pipe(
									oath.ops.chain(t =>
										oath
											.of(t.payload.sub)
											.pipe(oath.ops.chain(env.user_repository.read))
											.pipe(
												oath.ops.map(user => {
													const index = user[8].findIndex(session => t.payload.jti && session[0] === t.payload.jti)
													return [
														user.with(
															8,
															user[8].toSpliced(index, 1, [core.uuid.create(), core.timestamp.create(), user[8][index][2]]),
														) as Server.User.Instance,
														user[8][index],
													]
												}),
											),
									),
								)
								.pipe(
									oath.ops.chain(([user, session]) =>
										oath
											.from_promise(() => env.wjwt.sign({ jti: session[0], sub: user[0] }))
											.pipe(oath.ops.map(t => [user, t]))
											.pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.INVALID_SERVICE_INITIALIZATION))),
									),
								),
						),
					),
			),
		)
		.pipe(
			oath.ops.map(([user, t]) => {
				const res = Response.json(server.user.serialize(user))
				server_routary.set_auth_cookie(res, t[1].exp!, t[0])
				return res
			}),
		)
		.cata(oath.catas.or_else(env.fail))
