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
import * as id_common from "../common"

export const verify_code: Lib.Handler = ({ env, mut, request }) =>
	id_common
		.check_user_is_not_already_authenticated(request)
		.pipe(oath.ops.chain(check_x_device_header(request)))
		.pipe(oath.ops.chain(() => server_routary.oaths.get_json_body(request)))
		.pipe(oath.ops.chain(validate_body))
		.pipe(oath.ops.chain(body => oath.all([get_body_email(body), get_body_code(body)])))
		.pipe(oath.ops.chain(verify_user_code(env.code_service)))
		.pipe(oath.ops.chain(get_or_create_user(env.user_repository)))
		.pipe(oath.ops.chain(persist_user_session(request, env.user_repository)))
		.pipe(oath.ops.tap(u => env.hunter.shoot("auth.succeeded", [server.user.obfuscate_email(u[6]), mut.request_ip])))
		.pipe(
			oath.ops.chain(user =>
				oath
					.from_promise(() => env.wjwt.sign({ jti: user[8].at(-1)![0], sub: user[0] }))
					.pipe(oath.ops.map(t => [user, t]))
					.pipe(oath.ops.rmap(core.rrr.eio(CORE.RRR.REASON.INVALID_SERVICE_INITIALIZATION))),
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

// --- Internal ---

const verify_user_code =
	(code_service: Server.Code.Service) =>
	([email, code]: [Core.User.Email, Server.Code.Instance]) =>
		code_service
			.verify_code(email, code)
			.pipe(oath.ops.chain(v => oath.if(v, { t: () => email, f: core.rrr.enoent(CORE.RRR.REASON.USER_NOT_FOUND) })))

const add_session = (user: Server.User.Instance) => (name: string) =>
	user.with(8, [...user[8], [core.uuid.create(), core.timestamp.create(), name]]) as Server.User.Instance

const check_x_device_header =
	(request: Request) =>
	<$X>(x: $X) =>
		oath
			.if(request.headers.has("X-Device"))
			.pipe(oath.ops.map(() => x))
			.pipe(oath.ops.rmap(core.rrr.einval(CORE.RRR.REASON.MISSING_X_DEVICE_HEADER)))

const persist_user_session = (request: Request, user_repository: Server.User.Repository) => (user: Server.User.Instance) =>
	oath
		.of(request.headers.get("X-Device")!)
		.pipe(oath.ops.map(add_session(user)))
		.pipe(oath.ops.chain(user_repository.update))

const get_or_create_user = (user_repository: Server.User.Repository) => (email: Core.User.Email) =>
	user_repository.get_by_email(email).pipe(
		oath.ops.fix(rrr =>
			oath
				.if(rrr.type === CORE.RRR.TYPE.ENOENT)
				.pipe(oath.ops.map(() => server.user.create(email)))
				.pipe(oath.ops.chain(user_repository.create))
				.pipe(oath.ops.rmap(() => rrr)),
		),
	)

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
