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

import { Result } from "@ordo-pink/result"
import { create_zags } from "@ordo-pink/zags"
import { oath } from "@ordo-pink/oath"
import { rrr } from "@ordo-pink/core"

import { CurrentUser, PublicUser } from "../../../../core/src/user.impl"
import { ordo_app_state } from "../../../app.state"

const user_cache: Record<string, Ordo.User.Public.DTO> = {}

export const UserQuery: Ordo.User.QueryStatic = {
	Of: check_permission => {
		const version_zags = create_zags({ version: 0 })
		ordo_app_state.zags.cheat("user", (_, is_update) => is_update && version_zags.update("version", i => i + 1))

		const fetch = ordo_app_state.zags.select("fetch")
		const id_host = ordo_app_state.zags.select("hosts.id")

		return {
			is_authenticated: () =>
				check_permission("user.is_authenticated")
					.pipe(Result.ops.map(() => ordo_app_state.zags.select("user")))
					.pipe(Result.ops.map(user => !!user))
					.cata(Result.catas.or_else(() => false)),

			// TODO Allow user null
			get_current: () =>
				check_permission("user.get_current").pipe(Result.ops.chain(() => Result.Ok(ordo_app_state.zags.select("user")))),

			get_by_id: id =>
				check_permission("user.get_by_id")
					.cata({ Ok: () => oath.of(void 0), Err: rrr => oath.reject<Ordo.Rrr<"EPERM">, void>(rrr) })
					.pipe(
						oath.ops.and(() =>
							oath
								.if(CurrentUser.Validations.is_uid(id))
								.pipe(oath.ops.and(() => id))
								.pipe(oath.ops.rmap(() => rrr.codes.einval("Invalid user id"))),
						),
					)
					.pipe(
						oath.ops.and(
							id =>
								user_cache[id] ??
								oath
									.from_promise(() => fetch(`${id_host}/users/${id}`, { credentials: "include" }))
									.pipe(oath.ops.and(res => res.json()))
									.pipe(
										oath.ops.and(res =>
											oath.if(res.success, { on_true: () => res.payload, on_false: () => rrr.codes.eio(res.payload) }),
										),
									)
									.pipe(oath.ops.tap(dto => void (user_cache[dto.id] = dto))),
						),
					)
					.pipe(oath.ops.and(PublicUser.FromDTO)),

			get_by_handle: handle =>
				check_permission("user.get_by_id")
					.cata({ Ok: () => oath.of(void 0), Err: rrr => oath.reject<Ordo.Rrr<"EPERM">, void>(rrr) })
					.pipe(
						oath.ops.and(() =>
							oath
								.if(CurrentUser.Validations.is_handle(handle))
								.pipe(oath.ops.and(() => handle))
								.pipe(oath.ops.rmap(() => rrr.codes.einval("Invalid user handle"))),
						),
					)
					.pipe(
						oath.ops.and(
							handle =>
								user_cache[handle] ??
								oath
									.from_promise(() => fetch(`${id_host}/users/handle/${handle}`, { credentials: "include" }))
									.pipe(oath.ops.and(res => res.json()))
									.pipe(
										oath.ops.and(res =>
											oath.if(res.success, { on_true: () => res.payload, on_false: () => rrr.codes.eio(res.payload) }),
										),
									)
									.pipe(oath.ops.tap(dto => void (user_cache[dto.handle] = dto))),
						),
					)
					.pipe(oath.ops.and(PublicUser.FromDTO)),

			get $() {
				return version_zags
			},
		}
	},
}
