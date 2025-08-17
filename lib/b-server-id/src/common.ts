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
import type { Wjwt } from "@ordo-pink/oss-wjwt"
import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "./b-server-id.types"
import type { Colonoscope } from "@ordo-pink/oss-colonoscope"

export const extract_id_param = (params: Routary.RouteParams) => () =>
	oath.from_nullable(params && params.id, core.rrr.einval(CORE.RRR.REASON.USER_ID_MISSING))

export const check_is_executing_on_self = (request: Request) => (id: Core.User.Id) =>
	server_routary.oaths
		.get_auth_cookie(request)
		.pipe(oath.ops.chain(x => oath.if(x === id, { f: core.rrr.eperm(CORE.RRR.REASON.NO), t: () => id })))

export const check_user_is_authenticated = (request: Request, env: Lib.Env) =>
	server_routary.oaths
		.get_auth_cookie(request)
		.pipe(oath.ops.chain(x => oath.from_promise(() => env.wjwt.verify(x)).pipe(oath.ops.map(() => x as Wjwt.TokenString))))
		.pipe(oath.ops.map(x => env.wjwt.decode(x).payload))
		.pipe(oath.ops.chain(({ sub, jti }) => env.user_repository.read(sub).pipe(oath.ops.map(user => ({ user, jti })))))
		.pipe(oath.ops.chain(({ user, jti }) => oath.from_nullable(server.user.get_session(jti!, user)))) // TODO wjwt types
		.pipe(oath.ops.map(core.fns.prop(1)))
		.pipe(oath.ops.chain(t => oath.if(core.timestamp.is_after(Date.now() - env.session_lifetime_minutes * 60 * 1000, t))))
		.pipe(oath.ops.rmap(() => core.rrr.eacces(CORE.RRR.REASON.NO, void 0)))

export const get_request_param = (params: Colonoscope.Results, name: string) => oath.from_nullable(params && params[name])

export const get_param_id = (params: Colonoscope.Results) =>
	get_request_param(params, "id")
		.pipe(oath.ops.chain(i => oath.if(core.uuid.guard(i), { t: () => i as Core.Uuid.Instance, f: () => i })))
		.pipe(oath.ops.rmap(core.rrr.einval(CORE.RRR.REASON.USER_ID_INVALID)))

export const get_param_email = (params: Colonoscope.Results) =>
	get_request_param(params, "email")
		.pipe(oath.ops.chain(e => oath.if(core.user.email_guard(e), { t: () => e as Core.User.Email, f: () => e })))
		.pipe(oath.ops.rmap(core.rrr.einval(CORE.RRR.REASON.EMAIL_INVALID)))

export const get_param_ref = (params: Colonoscope.Results) =>
	get_request_param(params, "ref")
		.pipe(oath.ops.chain(e => oath.if(core.user.ref_guard(e), { t: () => e as Core.User.Ref, f: () => e })))
		.pipe(oath.ops.rmap(core.rrr.einval(CORE.RRR.REASON.REF_INVALID)))

export const check_user_is_not_already_authenticated = (request: Request) =>
	server_routary.oaths
		.get_auth_cookie(request)
		.pipe(oath.ops.swap)
		.pipe(oath.ops.map(core.fns.v))
		.pipe(oath.ops.rmap(core.rrr.eexist(CORE.RRR.REASON.ALREADY_AUTHENTICATED)))
