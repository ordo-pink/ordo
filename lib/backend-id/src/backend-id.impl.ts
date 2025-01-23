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

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { Routary, type TIntake } from "@ordo-pink/routary"
import { set_x_response_time_header, start_response_timer, stop_response_timer } from "@ordo-pink/backend-util-response-time"
import { create_response } from "@ordo-pink/backend-util-create-response"
import { extract_request_ip } from "@ordo-pink/backend-util-extract-request-ip"
import { log_request } from "@ordo-pink/backend-util-log-request"
import { set_content_type_application_json_header } from "@ordo-pink/backend-util-set-header"

import { type TIDChamber, type TSharedContext } from "./backend-id.types"
import { handle_cors } from "./handlers/cors.handler"
import { handle_delete_user } from "./handlers/user/delete-user.handler"
import { handle_get_user_by_handle } from "./handlers/user/get-user-by-handle.handler"
import { handle_get_user_by_id } from "./handlers/user/get-user-by-id.handler"
import { handle_invalidate } from "./handlers/auth/invalidate.handler"
import { handle_refresh } from "./handlers/auth/refresh.handler"
import { handle_request_code } from "./handlers/auth/request-code.handler"
import { handle_update_user } from "./handlers/user/update-user.handler"
import { handle_validate_code } from "./handlers/auth/validate-code.handler"

// TODO Global stats when API is ready

export const create_backend_id = ({ logger, user_persistence_strategy, token_persistence_strategy }: TIDChamber) =>
	// TODO Routary.use
	Routary.Start<TIDChamber>({ user_persistence_strategy, token_persistence_strategy, logger })
		// TODO Split into two libs/srvs
		.post("/auth/request-code", handle_request_code)
		.post("/auth/validate-code", handle_validate_code)
		.post("/auth/invalidate/:token_id", handle_invalidate)
		.post("/auth/refresh", handle_refresh)

		.get("/user/:user_id", handle_get_user_by_id)
		.get("/user/handle/:user_handle", handle_get_user_by_handle)
		.patch("/user/:user_id", handle_update_user)
		.delete("/user/:user_id", handle_delete_user)

		.options("/:section/:handler", handle_cors) // TODO Extract to lib, provide via Routary.use
		.get("/healthcheck", () => new Response("OK")) // TODO Extract to lib

		// TODO Extract to lib
		.or_else(intake =>
			Oath.Resolve<TIntake<TSharedContext>>({ ...intake, headers: {}, status: 404, request_ip: null })
				.pipe(ops0.tap(start_response_timer))
				.pipe(ops0.tap(extract_request_ip))
				.pipe(ops0.tap(set_content_type_application_json_header))
				.pipe(ops0.tap(stop_response_timer))
				.pipe(ops0.tap(set_x_response_time_header))
				.pipe(ops0.tap(log_request))
				.pipe(ops0.tap(intake => void (intake.payload = "resource not found")))
				.pipe(ops0.map(create_response))
				.invoke(invokers0.force_resolve),
		)
