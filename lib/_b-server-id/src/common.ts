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

import type { Colonoscope } from "@ordo-pink/oss-colonoscope"
import type { Wjwt } from "@ordo-pink/oss-wjwt"

import type * as ServerId from "./b-server-id.types"

export const get_auth_token0 = (request: Request) =>
	oath
		.from_nullable(request.headers.get("Cookie"))
		.pipe(oath.ops.map(Bun.Cookie.parse))
		.pipe(oath.ops.chain(c => oath.if_else(c.name === "ordo", { t: () => c.value })))
		.pipe(oath.ops.rmap(() => ordo.rrr.einval(ORDO.RRR.REASON.MISSING_REQUIRED_COOKIE, void 0)))

export const set_auth_cookie = ordo.fns.curry((response: Response, expires: Wjwt.Exp, token_string: Wjwt.TokenString) => {
	response.headers.set(
		"Set-Cookie",
		new Bun.Cookie("ordo", token_string, { expires, httpOnly: true, secure: true }).serialize(),
	)

	return response
})

/**
 * Get the JWT token from the cookie (lol what?) and check whether it is a
 * valid token and the user with `sub` id has a `jti`-identified session.
 * Return the user or an error occured along the way.
 *
 * **RRRs**:
 * - `EINVAL` - Auth token, session id, or user id are invalid
 * - `ENOENT` - Session or user not found
 * - `EIO` - Panic! at the Service
 */
export const get_authenticated_user0 = (
	request: Request,
	env: ServerId.Env,
): Oath.Instance<[Ordo.Session.Server.Instance, Ordo.User.Instance], Ordo.Rrr.Instance<"EIO" | "ENOENT" | "EINVAL">> =>
	get_auth_token0(request)
		.pipe(oath.ops.chain(env.token_service.verify0))
		.pipe(oath.ops.map(ordo.fns.prop("payload")))
		.pipe(oath.ops.map(({ sub, jti }) => [sub, jti]))
		.pipe(oath.ops.chain(([id, sid]) => oath.all([env.session_service.verify0(id, sid), env.user_service.get_user_by_id0(id)])))

export const check_user_is_not_already_authenticated0 = (request: Request) =>
	get_auth_token0(request)
		.pipe(oath.ops.swap)
		.pipe(oath.ops.bimap(ordo.fns.v, ordo.rrr.eexist(ORDO.RRR.REASON.ALREADY_AUTHENTICATED)))

export const get_param_id0 = (params: Colonoscope.Results) =>
	oath
		.from_nullable(params?.id, ordo.rrr.enoent(ORDO.RRR.REASON.USER_ID_MISSING))
		.pipe(oath.ops.chain(i => oath.if_else(ordo.uuid.guard(i), { t: () => i as Ordo.Uuid.Instance, f: () => i })))
		.pipe(oath.ops.rmap(ordo.rrr.einval(ORDO.RRR.REASON.USER_ID_INVALID)))

export const get_param_email0 = (params: Colonoscope.Results) =>
	oath
		.from_nullable(params?.email, ordo.rrr.enoent(ORDO.RRR.REASON.EMAIL_MISSING))
		.pipe(oath.ops.chain(e => oath.if_else(ordo.user.email_guard(e), { t: () => e as Ordo.User.Email, f: () => e })))
		.pipe(oath.ops.rmap(ordo.rrr.einval(ORDO.RRR.REASON.EMAIL_INVALID)))

export const get_param_ref0 = (params: Colonoscope.Results) =>
	oath
		.from_nullable(params?.ref, ordo.rrr.enoent(ORDO.RRR.REASON.REF_MISSING))
		.pipe(oath.ops.chain(e => oath.if_else(ordo.user.ref_guard(e), { t: () => e as Ordo.User.Ref, f: () => e })))
		.pipe(oath.ops.rmap(ordo.rrr.einval(ORDO.RRR.REASON.REF_INVALID)))
