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
import { RRR } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"
import { ZAGS } from "@ordo-pink/zags"

import { CurrentUser } from "../../../../core/src/user.impl"
import { ordo_app_state } from "../../../app.state"

export const UserQuery: Ordo.User.QueryStatic = {
	Of: check_permission => {
		const version_zags = ZAGS.Of({ version: 0 })
		ordo_app_state.zags.cheat("auth.user", (_, is_update) => is_update && version_zags.update("version", i => i + 1))

		const fetch = ordo_app_state.zags.select("fetch")
		const id_host = ordo_app_state.zags.select("hosts.id")
		const token = ordo_app_state.zags.select("auth.token")

		return {
			is_authenticated: () =>
				check_permission("user.is_authenticated")
					.pipe(Result.ops.map(() => ordo_app_state.zags.select("auth.user")))
					.pipe(Result.ops.map(user => !!user))
					.cata(Result.catas.or_else(() => false)),

			// TODO Allow user null
			get_current: () =>
				check_permission("user.get_current").pipe(Result.ops.chain(() => Result.Ok(ordo_app_state.zags.select("auth.user")))),

			get_by_id: id =>
				check_permission("user.get_by_id")
					.cata({ Ok: () => Oath.Resolve(void 0), Err: rrr => Oath.Reject<Ordo.Rrr<"EPERM">, void>(rrr) })
					.and(() =>
						Oath.If(CurrentUser.Validations.is_id(id))
							.and(() => id)
							.pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid user id"))),
					)
					.and(id => ({ id, headers: { Authorization: `Bearer ${token}` } }))
					.and(({ id, headers }) => Oath.FromPromise(() => fetch(`${id_host}/users/${id}`, { headers })))
					.and(res => res.json())
					.and(res => Oath.If(res.success, { T: () => res.payload, F: () => RRR.codes.eio(res.payload) })),

			get_by_handle: handle =>
				check_permission("user.get_by_id")
					.cata({ Ok: () => Oath.Resolve(void 0), Err: rrr => Oath.Reject<Ordo.Rrr<"EPERM">, void>(rrr) })
					.and(() =>
						Oath.If(CurrentUser.Validations.is_handle(handle))
							.and(() => handle)
							.pipe(ops0.rejected_map(() => RRR.codes.einval("Invalid user handle"))),
					)
					.and(handle => ({ handle, headers: { Authorization: `Bearer ${token}` } }))
					.and(({ handle, headers }) => Oath.FromPromise(() => fetch(`${id_host}/users/handle/${handle}`, { headers })))
					.and(res => res.json())
					.and(res => Oath.If(res.success, { T: () => res.payload, F: () => RRR.codes.eio(res.payload) })),

			get $() {
				return version_zags
			},
		}
	},
}
