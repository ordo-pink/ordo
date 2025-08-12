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
import { type Server, server } from "@ordo-pink/sdk-server"
import { oath } from "@ordo-pink/oss-oath"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "../b-server-id.types"

export const verify_code: Lib.Handler = ({ env, mut, request }) =>
	check_user_is_not_already_authenticated(request)
		.pipe(oath.ops.chain(() => server_routary.oaths.get_json_body(request)))
		.pipe(oath.ops.chain(validate_body))
		.pipe(oath.ops.chain(body => oath.all([get_body_email(body), get_body_code(body)])))
		.pipe(
			oath.ops.chain(([e, c]) =>
				env.code_service
					.verify_code(e, c)
					.pipe(oath.ops.chain(v => oath.if(v, { t: () => e, f: core.rrr.enoent(CORE.RRR.REASON.USER_NOT_FOUND) }))),
			),
		)
		.pipe(oath.ops.chain(get_or_create_user(env.user_repository)))
		// TODO Create and set session
		.pipe(oath.ops.tap(u => env.hunt.shoot("auth.succeeded", [u[6], mut.request_ip])))
		.pipe(oath.ops.map(server.user.serialize))
		.pipe(oath.ops.map(Response.json))
		.cata(oath.catas.or_else(env.fail))

// --- Internal ---

const get_or_create_user = (user_repository: Server.User.Repository) => (email: Core.User.Email) =>
	user_repository.get_by_email(email).pipe(
		oath.ops.fix(rrr =>
			oath
				.if(rrr.type === CORE.RRR.TYPE.ENOENT)
				.pipe(oath.ops.rmap(() => rrr))
				.pipe(oath.ops.chain(() => user_repository.create(server.user.create(email)))),
		),
	)

const check_user_is_not_already_authenticated = (request: Request) =>
	server_routary.oaths
		.get_auth_cookie(request)
		.pipe(oath.ops.swap)
		.pipe(oath.ops.rmap(core.rrr.eexist(CORE.RRR.REASON.ALREADY_AUTHENTICATED)))

const validate_body = (body: any) =>
	oath
		.if(body && core.fns.is_array(body))
		.pipe(oath.ops.map(() => body as any[]))
		.pipe(oath.ops.rmap(core.rrr.einval(CORE.RRR.REASON.MALFORMED_REQUEST_BODY)))

const get_body_email = (body: any) =>
	oath.from_nullable(body[0], core.rrr.einval(CORE.RRR.REASON.EMAIL_MISSING)).pipe(
		oath.ops.chain(email =>
			oath
				.if(core.user.email_guard(email))
				.pipe(oath.ops.rmap(() => core.rrr.einval(CORE.RRR.REASON.EMAIL_INVALID, email)))
				.pipe(oath.ops.map(() => email as Core.User.Email)),
		),
	)

const get_body_code = (body: any) =>
	oath.from_nullable(body[1], core.rrr.einval(CORE.RRR.REASON.EMAIL_MISSING)).pipe(
		oath.ops.chain(code =>
			oath
				.if(server.code.guard(code))
				.pipe(oath.ops.rmap(() => core.rrr.einval(CORE.RRR.REASON.CODE_INVALID, code)))
				.pipe(oath.ops.map(() => code as Server.Code.Instance)),
		),
	)
