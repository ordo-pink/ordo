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

import { CurrentUser, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { BackendUserKeys } from "@ordo-pink/backend"
import { type Intake } from "@ordo-pink/routary"
import { default_handler } from "@ordo-pink/backend-util-default-handler"
import { parse_json_body } from "@ordo-pink/backend-util-body"
import { is_non_empty_string } from "@ordo-pink/tau"

import { type TIDContext } from "../../backend-id.types"
import { create_session_id } from "../../common/create-session"
import { extract_body_email } from "../../common/extract-body-email"
import { persist_session_id } from "../../common/persist-session"

export const handle_validate_code = default_handler<TIDContext>(intake =>
	parse_json_body(intake)
		.pipe(ops0.chain(validate_request_body(intake)))
		.pipe(ops0.chain(validate_user_code(intake)))
		.pipe(ops0.chain(drop_user_code(intake)))
		.pipe(ops0.tap(send_sign_in_notification(intake)))
		.pipe(ops0.chain(create_session_id(intake)))
		.pipe(ops0.chain(persist_session_id(intake)))
		.pipe(
			ops0.tap(({ sid, user }) =>
				intake.headers.set(
					"Set-Cookie",
					`${user.get_uid()}=${sid[0]}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=${intake.session_lifetime}`,
				),
			),
		)
		.pipe(ops0.tap(({ user }) => void (intake.payload = CurrentUser.Serialize(user.to_dto()))))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = Intake<TIDContext>

const validate_request_body = (intake: I) => (body: any) =>
	Oath.Merge({
		email: extract_body_email(intake)(body),
		code: extract_body_email_code(intake)(body),
	})

const validate_user_code =
	(intake: I) =>
	({ email, code }: { email: Ordo.User.Email; code: string }) =>
		intake.user_persistence_strategy
			.get_by_email(email)
			.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
			.pipe(
				ops0.chain(user =>
					user
						.validate_code(code)
						.pipe(ops0.chain(is_valid => Oath.If(is_valid, { T: () => user })))
						.pipe(ops0.rejected_map(() => invalid_code_error(code, intake))),
				),
			)

const drop_user_code = (intake: I) => (user: OrdoBackend.User.Instance) =>
	intake.user_persistence_strategy
		.update(user.get_uid(), { ...user.to_dto(), [BackendUserKeys.EMAIL_CODE]: void 0 })
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
		.pipe(ops0.map(() => user))

// TODO Create email with Maoka
const send_sign_in_notification = (intake: I) => (user: OrdoBackend.User.Instance) =>
	intake.notification_strategy.send({
		to: user.get_email(),
		subject: "Account login",
		content: `Someone logged in (IP ${intake.request_ip?.address ?? "not detected"})`,
	})

export const invalid_code_error = (code: string, intake: I) => ({
	rrr: RRR.codes.eperm("Provided code is invalid", code),
	intake,
})

export const extract_body_email_code = (intake: I) => (request_body: any) =>
	Oath.FromNullable(request_body.code, () => email_code_not_provided_error(intake)).pipe(
		ops0.chain(code =>
			Oath.If(is_non_empty_string(code) && code.length === 6, {
				T: () => code as string,
				F: () => invalid_email_code_error(code, intake),
			}),
		),
	)

const invalid_email_code_error = (email: unknown, intake: I) => ({
	rrr: RRR.codes.einval("invalid email code", email),
	intake,
})

const email_code_not_provided_error = (intake: I) => ({
	rrr: RRR.codes.einval("email code not provided"),
	intake,
})
