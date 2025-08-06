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

import { core } from "@ordo-pink/sdk-core"
import { hunt } from "@ordo-pink/oss-hunt"
import { routary } from "@ordo-pink/oss-routary"
import { routary_cors } from "@ordo-pink/oss-routary-cors"
import { server } from "@ordo-pink/sdk-server"
import { server_core } from "@ordo-pink/b-server-core"

import type * as Lib from "./b-server-id.types"

export const create: Lib.Create = (
	logger,
	user_repository,
	code_lifetime_seconds,
	session_lifetime_minutes,
	_email_strategy,
	allowed_origins,
	codegen,
) => {
	// Email codes are stored in memory because nobody cares - just request another one
	const code_storage: Lib.CodeStorage = new Map()
	const partymaker = hunt.begin<Lib.Prey>()
	const allowed_headers = ["Content-Type", "Accept-Language", "X-Device-Info"]
	const allow_credentials = true

	// TODO Send email
	partymaker.track("auth.requested", ([user, code]) => logger.debug(user[0], code))

	const interval = setInterval(() => {
		const now = Date.now()

		for (const [email, { timestamp }] of code_storage.entries()) {
			if (now - timestamp > code_lifetime_seconds) {
				code_storage.delete(email)
				logger.debug("Removed outdated code for", server.user.obfuscate_email(email))
			}
		}
	}, code_lifetime_seconds)

	interval.unref()

	return server_core
		.create({ codegen, logger, partymaker, session_lifetime_minutes, user_repository })
		.pipe(routary.ops.once(routary_cors.create(allowed_origins, allowed_headers, allow_credentials)))
		.pipe(routary.ops.get("/healthcheck", () => new Response("OK")))
		.pipe(routary.ops.post("/auth/request-code", core.todo))
		.pipe(routary.ops.post("/auth/verify-code", core.todo))
		.pipe(routary.ops.post("/auth/refresh", core.todo))
		.pipe(routary.ops.get("/users/email/:email", core.todo))
		.pipe(routary.ops.get("/users/ref/:ref", core.todo))
		.pipe(routary.ops.get("/users/:id", core.todo))
		.pipe(routary.ops.patch("/users/:id/email", core.todo))
		.pipe(routary.ops.patch("/users/:id/handle", core.todo))
		.pipe(routary.ops.patch("/users/:id", core.todo))
		.pipe(routary.ops.delete("/users/:id", core.todo))
}
