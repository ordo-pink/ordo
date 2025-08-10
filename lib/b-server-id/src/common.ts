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

import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import type { Routary } from "@ordo-pink/oss-routary"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "./b-server-id.types"

const einval = curry(core.rrr.einval)
const to_missing_id_rrr = einval(CORE.RRR.REASON.USER_ID_MISSING)
export const extract_id_param = (params: Routary.RouteParams) => () =>
	oath.from_nullable(params && params.id, to_missing_id_rrr)

const to_non_permitted_rrr = () => core.rrr.eperm(CORE.RRR.REASON.OBVIOUS, void 0)
export const check_is_executing_on_self = (request: Bun.BunRequest) => (id: Core.User.Id) =>
	server_routary.oaths
		.get_cookie(request, "uid")
		.pipe(oath.ops.chain(cid => oath.if(cid === id, { on_true: () => id, on_false: to_non_permitted_rrr })))

const to_unauthorized_rrr = () => core.rrr.eacces(CORE.RRR.REASON.OBVIOUS, void 0)
const get_uuid_cookie = (request: Bun.BunRequest, name: string) =>
	server_routary.oaths
		.get_cookie(request, name)
		.pipe(oath.ops.chain(x => oath.if(core.uuid.guard(x), { on_true: () => x as Core.Uuid.Instance })))
export const check_user_is_authenticated = (request: Bun.BunRequest, env: Lib.Env) =>
	oath
		.merge({ uid: get_uuid_cookie(request, "uid"), sid: get_uuid_cookie(request, "sid") })
		.pipe(oath.ops.chain(({ uid, sid }) => env.user_repository.read(uid).pipe(oath.ops.map(user => ({ user, sid })))))
		.pipe(oath.ops.chain(({ user, sid }) => oath.from_nullable(server.user.get_session(sid, user))))
		.pipe(oath.ops.map(core.fns.prop(1)))
		.pipe(oath.ops.chain(t => oath.if(core.timestamp.is_after(Date.now() - env.session_lifetime_minutes * 60, t))))
		.pipe(oath.ops.rmap(to_unauthorized_rrr))
