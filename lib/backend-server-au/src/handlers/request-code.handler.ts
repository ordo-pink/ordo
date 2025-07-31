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

import { type Core, core } from "@ordo-pink/sdk-core"
import { type Oath, oath } from "@ordo-pink/oath"
import { type Server, server } from "@ordo-pink/sdk-server"
import { default_handler, huyami } from "@ordo-pink/routary-ordo"

import type * as Types from "../backend-server-au.types"
import { create_request_code_email_body, create_request_code_email_subject } from "../fns"

export const handle_request_code = default_handler<Types.Fuel>(intake => {
	const debug = huyami(intake)

	return get_request_body(intake.req)
		.pipe(oath.ops.chain(validate_request_body))
		.pipe(oath.ops.tap(debug("Provided email", email => server.user.obfuscate_email(email))))
		.pipe(oath.ops.chain(create_code(intake.code_strategy)))
		.pipe(oath.ops.tap(debug("Code generated")))
		.pipe(oath.ops.tap(persist_pair(intake.code_storage)))
		.pipe(oath.ops.tap(debug("Auth record persisted")))
		.pipe(oath.ops.tap(send_email(intake)))
		.pipe(oath.ops.tap(debug("Email sent")))
		.pipe(oath.ops.map(() => intake))
		.pipe(oath.ops.rmap(rrr => ({ intake, rrr })))
})

// --- Internal ---

// TODO Move to lib

const get_request_body = (req: Request): Oath.Instance<any, Core.Rrr.Instance<"EIO">> =>
	oath.from_promise(() => req.json()).pipe(oath.ops.rmap(error => core.rrr.eio("Failed to parse request body", error)))

const validate_request_body = (body: any) =>
	oath.if(body && body.email && core.user.email_guard(body.email), {
		on_true: () => body.email as Core.User.Email,
		on_false: () => core.rrr.einval("Provided email is invalid", body.email),
	})

type Triplet = [Core.User.Email, Types.Code, Types.CodeHash]

const create_code = (code_strategy: Server.Codegen.Instance) => (email: Core.User.Email) =>
	code_strategy
		.generate()
		.pipe(oath.ops.chain(code => code_strategy.hash(code).pipe(oath.ops.map(hash => [code, hash]))))
		.pipe(oath.ops.map(([code, hash]) => [email, code, hash] as Triplet))

const persist_pair =
	(auth_storage: Types.CodeStorage) =>
	([email, , hash]: Triplet): void =>
		void auth_storage.set(email, { hash, timestamp: Date.now() })

const send_email =
	(intake: Types.Intake) =>
	([email, code]: Triplet): Promise<void> =>
		intake.email_strategy.send(
			email + code,
			create_request_code_email_subject(intake.request_language),
			create_request_code_email_body(intake.request_language, code),
			{ email },
		)
