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

import * as tau from "@ordo-pink/_tau"
import { type Core, core } from "@ordo-pink/sdk-core"
import { Oath, oath } from "@ordo-pink/oss-oath"
import { default_handler, huyami } from "@ordo-pink/b-server-core"

import * as Types from "../backend-server-au.types"
import { create_user_authenticated_email_body, create_user_authenticated_email_subject } from "../fns"
import { server } from "@ordo-pink/sdk-server"

export const handle_verify_code = default_handler<Types.Fuel>(intake => {
	const debug = huyami(intake)

	return get_request_body(intake.req)
		.pipe(oath.ops.chain(validate_request_body))
		.pipe(oath.ops.tap(debug("Provided email", ({ email }) => obfuscate_email(email))))
		.pipe(oath.ops.chain(get_code_hash(intake)))
		.pipe(oath.ops.tap(debug("Code verified successfully")))
		.pipe(oath.ops.tap(remove_auth_record(intake.code_storage)))
		.pipe(oath.ops.tap(debug("Auth record removed")))
		.pipe(oath.ops.chain(get_or_create_user(intake)))
		.pipe(oath.ops.tap(debug("User upserted", user => user[0])))
		.pipe(oath.ops.tap(send_email(intake)))
		.pipe(oath.ops.tap(debug("Email sent")))
		.pipe(oath.ops.chain(create_session_id(intake)))
		.pipe(oath.ops.chain(persist_session_id(intake)))
		.pipe(oath.ops.tap(debug("User session persisted")))
		.pipe(oath.ops.tap(set_cookie(intake)))
		.pipe(oath.ops.map(({ user }) => void (intake.res.body = JSON.stringify(user.to_dto()))))
		.pipe(oath.ops.map(() => intake))
		.pipe(oath.ops.rtap(() => intake.res.headers.delete("Set-Cookie")))
		.pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
})

// --- Internal ---

const is_code = (x: unknown): x is number => tau.is_finite_non_negative_int(x)

// TODO Move to lib

const get_request_body = (req: Request): Oath.Instance<any, Core.Rrr.Instance<"EIO">> =>
	oath.from_promise(() => req.json()).pipe(oath.ops.rmap(error => core.rrr.eio("Failed to parse request body", error)))

const validate_request_body = (body: any) =>
	oath.merge({
		email: oath.if(body && body.email && core.user.email_guard(body.email), {
			on_true: () => body.email as Core.User.Email,
			on_false: () => core.rrr.einval("Provided email is invalid", body.email),
		}),
		code: oath.if(body && body.code && is_code(body.code), {
			on_true: () => body.code as Types.Code,
			on_false: () => core.rrr.einval("Provided code is invalid", body.code),
		}),
	})

type P1 = { email: Core.User.Email; code: Types.Code }

const not_found_rrr = (email: Core.User.Email) => () => core.rrr.enoent("User not found", server.user.obfuscate_email(email))

const get_code_hash =
	(intake: Types.Intake) =>
	({ email, code }: P1) =>
		oath
			.from_nullable(intake.code_storage.get(email), not_found_rrr(email))
			.pipe(oath.ops.chain(({ hash }) => intake.code_strategy.verify(hash, code)))
			.pipe(oath.ops.chain(is_valid => oath.if(is_valid, { on_true: () => email, on_false: not_found_rrr(email) })))

const remove_auth_record =
	(code_storage: Types.CodeStorage) =>
	(email: Core.User.Email): void =>
		void code_storage.delete(email)

const send_email = (intake: Types.Intake) => (user: Core.User.Instance) =>
	intake.email_strategy.send(
		user[6] + intake.request_ip, // TODO
		create_user_authenticated_email_subject(intake.request_language),
		create_user_authenticated_email_body(intake.request_language, intake.request_ip as string),
		{ email: user[6] },
	)

const create_user = (email: Core.User.Email) => (intake: Types.Intake) =>
	oath.of(server.user.create(email)).pipe(oath.ops.chain(user => intake.user_repository.create(user)))

const get_or_create_user = (intake: Types.Intake) => (email: Core.User.Email) =>
	intake.user_repository
		.get_by_email(email)
		.pipe(oath.ops.rmap(() => intake))
		.pipe(oath.ops.fix(create_user(email)))

const create_session_id = (intake: Types.Intake) => (user: Core.User.Instance) =>
	oath
		.try(() => server.user.create_session(intake.req.headers.get("X-Device")))
		.pipe(oath.ops.map(session => ({ session, user })))
		.pipe(oath.ops.rmap(error => core.rrr.eio("Failed to create session", error)))

type P2 = { session: Core.Session.Instance; user: Core.User.Instance }
const persist_session_id = (intake: Types.Intake) => (params: P2) =>
	oath
		.of(params.user)
		.pipe(oath.ops.map(user => user.with(8, [...user[8], params.session])))
		.pipe(oath.ops.chain(user => intake.user_repository.update(params.user[0], user)))
		.pipe(oath.ops.map(() => params))

const set_cookie = (intake: Types.Intake) => (params: P2) =>
	intake.res.headers.set(
		"Set-Cookie",
		`${params.user[0]}=${params.session[0]}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${intake.session_lifetime_seconds}`,
	)
