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

import * as tau from "@ordo-pink/tau"
import { CurrentUser, CurrentUserKeys, rrr } from "@ordo-pink/core"
import { Oath, oath } from "@ordo-pink/oath"
import { default_handler, huyami } from "@ordo-pink/routary-ordo"

import * as fns from "../fns"
import { type BackendAuth } from "../backend-server-au.types"

export const handle_verify_code = default_handler<BackendAuth.Fuel>(intake => {
	const debug = huyami(intake)

	return get_request_body(intake.req)
		.pipe(oath.ops.chain(validate_request_body))
		.pipe(oath.ops.tap(debug("Provided email", ({ email }) => fns.obfuscate_email(email))))
		.pipe(oath.ops.chain(get_code_hash(intake)))
		.pipe(oath.ops.tap(debug("Code verified successfully")))
		.pipe(oath.ops.tap(remove_auth_record(intake.auth_storage)))
		.pipe(oath.ops.tap(debug("Auth record removed")))
		.pipe(oath.ops.chain(get_or_create_user(intake)))
		.pipe(oath.ops.tap(debug("User upserted", user => user.get_uid())))
		.pipe(oath.ops.tap(send_email(intake)))
		.pipe(oath.ops.tap(debug("Email sent")))
		.pipe(oath.ops.chain(create_session_id(intake)))
		.pipe(oath.ops.chain(persist_session_id(intake)))
		.pipe(oath.ops.tap(debug("User session persisted")))
		.pipe(oath.ops.tap(set_cookie(intake)))
		.pipe(oath.ops.map(({ user }) => void (intake.payload = CurrentUser.Serialize(user.to_dto()))))
		.pipe(oath.ops.map(() => intake))
		.pipe(oath.ops.rtap(() => intake.headers.delete("Set-Cookie")))
		.pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
})

// --- Internal ---

const is_email = CurrentUser.Validations.is_email
const is_code = (x: unknown): x is number => tau.is_finite_non_negative_int(x)

// TODO Move to lib

const get_request_body = (req: Request): Oath.Instance<any, Ordo.Rrr<"EIO">> =>
	oath.from_promise(() => req.json()).pipe(oath.ops.rmap(error => rrr.codes.eio("Failed to parse request body", error)))

const validate_request_body = (body: any) =>
	oath.merge({
		email: oath.if(body && body.email && is_email(body.email), {
			on_true: () => body.email as BackendAuth.Email,
			on_false: () => rrr.codes.einval("Provided email is invalid", body.email),
		}),
		code: oath.if(body && body.code && is_code(body.code), {
			on_true: () => body.code as BackendAuth.Code,
			on_false: () => rrr.codes.einval("Provided code is invalid", body.code),
		}),
	})

type P1 = { email: BackendAuth.Email; code: BackendAuth.Code }

const not_found_rrr = (email: BackendAuth.Email) => () => rrr.codes.enoent("User not found", fns.obfuscate_email(email))

const get_code_hash =
	(intake: BackendAuth.Intake) =>
	({ email, code }: P1) =>
		oath
			.from_nullable(intake.auth_storage.get(email), not_found_rrr(email))
			.pipe(oath.ops.chain(({ hash }) => intake.code_strategy.verify(hash, code)))
			.pipe(oath.ops.chain(is_valid => oath.if(is_valid, { on_true: () => email, on_false: not_found_rrr(email) })))

const remove_auth_record =
	(auth_storage: BackendAuth.Storage) =>
	(email: BackendAuth.Email): void =>
		void auth_storage.delete(email)

const send_email =
	(intake: BackendAuth.Intake) =>
	(user: Ordo.User.Current.Instance): void =>
		intake.email_strategy.send({
			to: user.get_email(),
			content: fns.create_user_authenticated_email_body(intake.request_language, intake.request_ip as string),
			subject: fns.create_user_authenticated_email_subject(intake.request_language),
		})

const create_user = (email: Ordo.User.Email) => (intake: BackendAuth.Intake) =>
	oath
		.of(intake.defaults)
		.pipe(oath.ops.map(d => CurrentUser.Create(email, d.file_limit, d.max_upload_size, d.max_functions)))
		.pipe(oath.ops.chain(intake.persistence_strategy_user.create))

const get_or_create_user = (intake: BackendAuth.Intake) => (email: Ordo.User.Email) =>
	intake.reference_mapping_user
		.exists_by_email(email)
		.pipe(
			oath.ops.chain(exists =>
				oath
					.if(exists)
					.pipe(oath.ops.chain(() => intake.reference_mapping_user.get_by_email(email)))
					.pipe(oath.ops.chain(id => intake.persistence_strategy_user.read(id))),
			),
		)
		.pipe(oath.ops.rmap(() => intake))
		.pipe(oath.ops.fix(create_user(email)))

const create_session_id = (intake: BackendAuth.Intake) => (user: Ordo.User.Current.Instance) =>
	oath
		.try(() => [crypto.randomUUID(), Date.now(), `${intake.req.headers.get("X-Device")}`] as Ordo.User.Session)
		.pipe(oath.ops.map(sid => ({ sid, user })))
		.pipe(oath.ops.rmap(error => rrr.codes.eio("Failed to create session", error)))

type P2 = { sid: Ordo.User.Session; user: Ordo.User.Current.Instance }
const persist_session_id = (intake: BackendAuth.Intake) => (params: P2) =>
	oath
		.of(params.user.to_dto())
		.pipe(oath.ops.tap(dto => void (dto[CurrentUserKeys.SESSIONS] = [...dto[CurrentUserKeys.SESSIONS], params.sid])))
		.pipe(oath.ops.chain(dto => intake.persistence_strategy_user.update(params.user.get_uid(), CurrentUser.FromDTO(dto))))
		.pipe(oath.ops.chain(user => intake.reference_mapping_user.refresh(user.get_uid())))
		.pipe(oath.ops.map(() => params))

const set_cookie = (intake: BackendAuth.Intake) => (params: P2) =>
	intake.headers.set(
		"Set-Cookie",
		`${params.user.get_uid()}=${params.sid[0]}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${intake.session_lifetime_s}`,
	)
