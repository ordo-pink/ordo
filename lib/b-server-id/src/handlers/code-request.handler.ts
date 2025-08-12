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
import { oath } from "@ordo-pink/oss-oath"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "../b-server-id.types"

export const request_code: Lib.Handler = ({ env, request }) =>
	check_user_is_not_already_authenticated(request)
		.pipe(oath.ops.chain(() => server_routary.oaths.get_json_body(request)))
		.pipe(oath.ops.chain(get_body_email))
		.pipe(oath.ops.chain(email => env.code_service.assign_code(email).pipe(oath.ops.map(code => [email, code]))))
		.pipe(oath.ops.tap(([email, code]) => env.hunt.shoot("auth.requested", [email, code])))
		.pipe(oath.ops.map(() => new Response("", { status: 204 })))
		.cata(oath.catas.or_else(env.fail))

// --- Internal ---

const check_user_is_not_already_authenticated = (request: Request) =>
	server_routary.oaths
		.get_auth_cookie(request)
		.pipe(oath.ops.swap)
		.pipe(oath.ops.rmap(core.rrr.eexist(CORE.RRR.REASON.ALREADY_AUTHENTICATED)))

const get_body_email = (body: any) =>
	oath
		.if(body && core.fns.is_array(body) && body[0])
		.pipe(oath.ops.bimap(() => body, core.rrr.einval(CORE.RRR.REASON.EMAIL_MISSING)))
		.pipe(
			oath.ops.chain(email =>
				oath
					.if(core.user.email_guard(email))
					.pipe(oath.ops.rmap(() => core.rrr.einval(CORE.RRR.REASON.EMAIL_INVALID, email)))
					.pipe(oath.ops.map(() => email as Core.User.Email)),
			),
		)
