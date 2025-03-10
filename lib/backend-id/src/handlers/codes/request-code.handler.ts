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

import { BackendUser, BackendUserKeys } from "@ordo-pink/backend"
import { Oath, ops0 } from "@ordo-pink/oath"
import { extract_request_body, unknown_error } from "@ordo-pink/backend-util-extract-body"
import { type TIntake } from "@ordo-pink/routary"
import { default_handler } from "@ordo-pink/backend-util-default-handler"

import { type TIDContext } from "../../backend-id.types"
import { extract_body_email } from "../../common/extract-body-email"

export const handle_request_code = default_handler<TIDContext>(intake =>
	extract_request_body(intake)
		.pipe(ops0.chain(extract_body_email(intake)))
		.pipe(ops0.chain(get_or_create_user(intake)))
		.pipe(ops0.chain(update_user_code(intake)))
		.pipe(ops0.tap(send_code(intake)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = TIntake<TIDContext>

const hash_argon2 = (intake: I) => (code: string) =>
	Oath.FromPromise(() => Bun.password.hash(code))
		.pipe(ops0.map(hash => ({ code, hash })))
		.pipe(ops0.rejected_map(e => unknown_error(e, intake)))

const get_or_create_user = (intake: I) => (email: Ordo.User.Email) =>
	intake.user_persistence_strategy
		.get_by_email(email)
		.pipe(ops0.rejected_map(() => intake))
		.fix(create_user(email))

const update_user_code = (intake: I) => (user: OrdoBackend.User.Instance) =>
	Oath.Resolve(new Uint8Array(6))
		.pipe(ops0.map(ua => crypto.getRandomValues(ua)))
		.pipe(ops0.map(nums => nums.join("")))
		.pipe(ops0.map(str => str.slice(0, 6)))
		.pipe(ops0.chain(hash_argon2(intake)))
		.pipe(ops0.map(codes => ({ codes, user })))
		.pipe(
			ops0.chain(({ codes, user }) =>
				intake.user_persistence_strategy
					.update(user.get_uid(), { ...user.to_dto(), [BackendUserKeys.EMAIL_CODE]: codes.hash })
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake: intake })))
					.pipe(ops0.map(() => ({ codes, email: user.get_email() }))),
			),
		)

const create_user = (email: Ordo.User.Email) => (intake: I) =>
	intake.user_persistence_strategy
		.create(BackendUser.New(email, intake.defaults.file_limit, intake.defaults.max_upload_size, intake.defaults.max_functions))
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake: intake })))

type P2 = { codes: { code: string; hash: string }; email: Ordo.User.Email }
const send_code =
	(intake: I) =>
	({ codes, email }: P2) =>
		// TODO Create email with Maoka
		intake.notification_strategy.send({
			to: email,
			subject: "Sign in code for your ORDO account",
			content: `Code: ${codes.code} -> Link: ${intake.web_host}/auth/verify?email=${email}&code=${codes.code}`,
		})
