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

import { current_user, rrr } from "@ordo-pink/core"
import { Oath, oath } from "@ordo-pink/oath"
import { default_handler, huyami } from "@ordo-pink/routary-ordo"

import * as fns from "../fns"
import { type BackendAuth } from "../backend-server-au.types"

export const handle_request_code = default_handler<BackendAuth.Fuel>(intake => {
	const debug = huyami(intake)

	return get_request_body(intake.req)
		.pipe(oath.ops.chain(validate_request_body))
		.pipe(oath.ops.tap(debug("Provided email", email => fns.obfuscate_email(email))))
		.pipe(oath.ops.chain(create_code(intake.code_strategy)))
		.pipe(oath.ops.tap(debug("Code generated")))
		.pipe(oath.ops.tap(persist_pair(intake.auth_storage)))
		.pipe(oath.ops.tap(debug("Auth record persisted")))
		.pipe(oath.ops.tap(send_email(intake)))
		.pipe(oath.ops.tap(debug("Email sent")))
		.pipe(oath.ops.map(() => intake))
		.pipe(oath.ops.rmap(rrr => ({ intake, rrr })))
})

// --- Internal ---

const is_email = current_user.validations.is_email

// TODO Move to lib

const get_request_body = (req: Request): Oath.Instance<any, Ordo.Rrr<"EIO">> =>
	oath.from_promise(() => req.json()).pipe(oath.ops.rmap(error => rrr.codes.eio("Failed to parse request body", error)))

const validate_request_body = (body: any) =>
	oath.if(body && body.email && is_email(body.email), {
		on_true: () => body.email as BackendAuth.Email,
		on_false: () => rrr.codes.einval("Provided email is invalid", body.email),
	})

type Triplet = [BackendAuth.Email, BackendAuth.Code, BackendAuth.CodeHash]

const create_code = (code_strategy: BackendAuth.CodeStrategy) => (email: BackendAuth.Email) =>
	code_strategy
		.generate()
		.pipe(oath.ops.chain(code => code_strategy.hash(code).pipe(oath.ops.map(hash => [code, hash]))))
		.pipe(oath.ops.map(([code, hash]) => [email, code, hash] as Triplet))

const persist_pair =
	(auth_storage: BackendAuth.Storage) =>
	([email, , hash]: Triplet): void =>
		void auth_storage.set(email, { hash, timestamp: Date.now() })

const send_email =
	(intake: BackendAuth.Intake) =>
	([email, code]: Triplet): void =>
		intake.email_strategy.send({
			to: email,
			content: fns.create_request_code_email_body(intake.request_language, code),
			subject: fns.create_request_code_email_subject(intake.request_language),
		})
