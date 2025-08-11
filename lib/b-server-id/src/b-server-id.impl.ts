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

import { hunt as lib_hunt } from "@ordo-pink/oss-hunt"
import { routary } from "@ordo-pink/oss-routary"
import { routary_cors } from "@ordo-pink/oss-routary-cors"
import { server } from "@ordo-pink/sdk-server"
import { server_routary } from "@ordo-pink/sdk-server-routary"

import type * as Lib from "./b-server-id.types"
import * as handlers from "./handlers"

export const create: Lib.Create = (
	logger,
	user_repository,
	code_lifetime_seconds,
	session_lifetime_minutes,
	_email_strategy,
	allowed_origins,
	codegen,
	wjwt,
) => {
	const hunt = lib_hunt.begin<Lib.Prey>()
	const allowed_headers = ["Content-Type", "Accept-Language", "X-Device-Info"]
	const allow_credentials = true
	const code_service = server.code.create_service(codegen, code_lifetime_seconds, logger)

	// TODO Send email
	const release_auth_requested = hunt.track("auth.requested", ([user, code]) => logger.debug(user[0], code))

	process.on("exit", () => {
		release_auth_requested()
		code_service.die()
	})

	return server_routary
		.create({ code_service, logger, hunt, session_lifetime_minutes, user_repository, wjwt })
		.pipe(routary.ops.once(routary_cors.create(allowed_origins, allowed_headers, allow_credentials)))
		.pipe(routary.ops.post("/auth/request-code", handlers.request_code))
		.pipe(routary.ops.post("/auth/verify-code", handlers.verify_code))
		.pipe(routary.ops.post("/auth/refresh", handlers.refresh_session))
		.pipe(routary.ops.get("/users/email/:email", handlers.get_user_by_email))
		.pipe(routary.ops.patch("/users/email/:id", handlers.update_email))
		.pipe(routary.ops.get("/users/ref/:ref", handlers.get_user_by_ref))
		.pipe(routary.ops.patch("/users/ref/:id", handlers.update_ref))
		.pipe(routary.ops.get("/users/:id", handlers.get_user_by_id))
		.pipe(routary.ops.patch("/users/:id", handlers.update_user))
		.pipe(routary.ops.delete("/users/:id", handlers.delete_user))
}
