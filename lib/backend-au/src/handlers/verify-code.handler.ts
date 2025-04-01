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
import { CurrentUser, CurrentUserKeys, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { default_handler, huyami } from "@ordo-pink/routary-ordo"

import * as fns from "../fns"
import { type BackendAuth } from "../backend-au.types"

export const handle_verify_code = default_handler<BackendAuth.Chamber>(intake => {
	intake.request_id = intake.create_request_id()
	intake.request_language = fns.get_lang(intake.req)
	const debug = huyami(intake)

	return get_request_body(intake.req)
		.pipe(ops0.chain(validate_request_body))
		.pipe(ops0.tap(debug("Provided email", ({ email }) => fns.obfuscate_email(email))))
		.pipe(ops0.chain(get_code_hash(intake)))
		.pipe(ops0.tap(debug("Code verified successfully")))
		.pipe(ops0.tap(remove_auth_record(intake.auth_storage)))
		.pipe(ops0.tap(debug("Auth record removed")))
		.pipe(ops0.chain(get_or_create_user(intake)))
		.pipe(ops0.tap(debug("User upserted", user => user.get_uid())))
		.pipe(ops0.tap(send_email(intake)))
		.pipe(ops0.tap(debug("Email sent")))
		.pipe(ops0.chain(create_session_id(intake)))
		.pipe(ops0.chain(persist_session_id(intake)))
		.pipe(ops0.tap(debug("User session persisted")))
		.pipe(ops0.tap(set_cookie(intake)))
		.pipe(ops0.map(({ user }) => void (intake.payload = CurrentUser.Serialize(user.to_dto()))))
		.pipe(ops0.map(() => intake))
		.pipe(
			ops0.rejected_map(rrr => {
				intake.headers.delete("Set-Cookie")
				return { intake, rrr }
			}),
		)
})

// --- Internal ---

const is_email = CurrentUser.Validations.is_email
const is_code = (x: unknown): x is number => tau.is_finite_non_negative_int(x)

// TODO Move to lib

const get_request_body = (req: Request): Oath<any, Ordo.Rrr<"EIO">> =>
	Oath.Try(
		() => req.json(),
		error => RRR.codes.eio("Failed to parse request body", error),
	)

const validate_request_body = (body: any) =>
	Oath.Merge({
		email: Oath.If(body && body.email && is_email(body.email), {
			T: () => body.email as BackendAuth.Email,
			F: () => RRR.codes.einval("Provided email is invalid", body.email),
		}),
		code: Oath.If(body && body.code && is_code(body.code), {
			T: () => body.code as BackendAuth.Code,
			F: () => RRR.codes.einval("Provided code is invalid", body.code),
		}),
	})

type P1 = { email: BackendAuth.Email; code: BackendAuth.Code }

const not_found_rrr = (email: BackendAuth.Email) => () => RRR.codes.enoent("User not found", fns.obfuscate_email(email))

const get_code_hash =
	(intake: BackendAuth.Intake) =>
	({ email, code }: P1) =>
		Oath.FromNullable(intake.auth_storage.get(email), not_found_rrr(email))
			.pipe(ops0.chain(({ hash }) => intake.code_strategy.verify(hash, code)))
			.pipe(ops0.chain(is_valid => Oath.If(is_valid, { T: () => email, F: not_found_rrr(email) })))

const remove_auth_record =
	(auth_storage: BackendAuth.Storage) =>
	(email: BackendAuth.Email): void =>
		void auth_storage.delete(email)

const send_email =
	(intake: BackendAuth.Intake) =>
	(user: Ordo.User.Current.Instance): void =>
		intake.email_strategy.send({
			to: user.get_email(),
			content: fns.create_user_authenticated_email_body(intake.request_language, intake.request_ip!),
			subject: fns.create_user_authenticated_email_subject(intake.request_language),
		})

const create_user = (email: Ordo.User.Email) => (intake: BackendAuth.Intake) =>
	Oath.Resolve(intake.defaults)
		.pipe(ops0.map(d => CurrentUser.Create(email, d.file_limit, d.max_upload_size, d.max_functions)))
		.pipe(ops0.chain(intake.persistence_strategy_user.create))

const get_or_create_user = (intake: BackendAuth.Intake) => (email: Ordo.User.Email) =>
	intake.reference_mapping_user
		.exists_by_email(email)
		.pipe(
			ops0.chain(exists =>
				Oath.If(exists)
					.pipe(ops0.chain(() => intake.reference_mapping_user.get_by_email(email)))
					.pipe(ops0.chain(id => intake.persistence_strategy_user.read(id))),
			),
		)
		.pipe(ops0.rejected_map(() => intake))
		.fix(create_user(email))

const create_session_id = (intake: BackendAuth.Intake) => (user: Ordo.User.Current.Instance) =>
	Oath.Try(() => [crypto.randomUUID(), Date.now(), `${intake.req.headers.get("X-Device")}`] as Ordo.User.Session)
		.pipe(ops0.map(sid => ({ sid, user })))
		.pipe(ops0.rejected_map(error => RRR.codes.eio("Failed to create session", error)))

type P2 = { sid: Ordo.User.Session; user: Ordo.User.Current.Instance }
const persist_session_id = (intake: BackendAuth.Intake) => (params: P2) =>
	Oath.Resolve(params.user.to_dto())
		.pipe(ops0.tap(dto => void (dto[CurrentUserKeys.SESSIONS] = [...dto[CurrentUserKeys.SESSIONS], params.sid])))
		.and(dto => intake.persistence_strategy_user.update(params.user.get_uid(), CurrentUser.FromDTO(dto)))
		.pipe(ops0.chain(user => intake.reference_mapping_user.refresh(user.get_uid())))
		.and(() => params)

const set_cookie = (intake: BackendAuth.Intake) => (params: P2) =>
	intake.headers.set(
		"Set-Cookie",
		`${params.user.get_uid()}=${params.sid[0]}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${intake.session_lifetime_s}`,
	)
