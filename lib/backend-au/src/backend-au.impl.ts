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

import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"
import { rickroll } from "@ordo-pink/rickroll"
import { routary } from "@ordo-pink/routary"
import { routary_cors } from "@ordo-pink/routary-cors"

import * as fns from "./fns"
import { BackendAuth } from "./backend-au.types"
import { handle_request_code } from "./handlers/request-code.handler"
import { handle_verify_code } from "./handlers/verify-code.handler"

export const create_backend_auth = (params: BackendAuth.Params) => {
	const interval = setInterval(() => {
		const now = Date.now()

		params.auth_storage.entries().forEach(([email, { timestamp }]) => {
			if (now - timestamp > params.code_lifetime_ms) {
				params.auth_storage.delete(email)
				params.logger.debug("Removed outdated code for", fns.obfuscate_email(email))
			}
		})
	}, 15 * 1000)

	interval.unref()

	return routary
		.create({ ...params, status: 200, headers: new Headers(), request_language: TWO_LETTER_LOCALE.ENGLISH })
		.post("/request-code", handle_request_code)
		.post("/verify-code", handle_verify_code)
		.get("/healthcheck", () => new Response("OK")) // TODO Extract to lib
		.use(routary_cors({ allow_origin: params.allow_origin, allow_headers: ["content-type"] }))
		.start(() => rickroll)
}
