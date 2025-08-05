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

import { LOCALE } from "@ordo-pink/oss-i18n"
import { rickroll } from "@ordo-pink/oss-rickroll"
import { routary } from "@ordo-pink/oss-routary"
import { routary_cors } from "@ordo-pink/oss-routary-cors"

import * as Types from "./backend-server-au.types"
import { handle_request_code } from "./handlers/request-code.handler"
import { handle_verify_code } from "./handlers/verify-code.handler"
import { server } from "@ordo-pink/sdk-server"

export const create: Types.Create = (
	allow_origin,
	code_lifetime_ms,
	code_strategy,
	data_repository,
	email_strategy,
	logger,
	session_lifetime_seconds,
	user_repository,
) => {
	const code_storage: Types.CodeStorage = new Map()

	const interval = setInterval(() => {
		const now = Date.now()

		for (const [email, { timestamp }] of code_storage.entries()) {
			if (now - timestamp > code_lifetime_ms) {
				code_storage.delete(email)
				logger.debug("Removed outdated code for", server.user.obfuscate_email(email))
			}
		}
	}, code_lifetime_ms)

	interval.unref()

	return routary
		.http<Types.Fuel>({
			code_storage,
			code_strategy,
			data_repository,
			email_strategy,
			logger,
			request_language: LOCALE.ENGLISH,
			session_lifetime_seconds,
			user_repository,
		})
		.post("/request-code", handle_request_code)
		.post("/verify-code", handle_verify_code)
		.get("/healthcheck", () => new Response("OK")) // TODO Extract to lib
		.use(routary_cors({ allow_origin: allow_origin, allow_headers: ["content-type", "x-device"], allow_credentials: true }))
		.start(() => rickroll)
}
