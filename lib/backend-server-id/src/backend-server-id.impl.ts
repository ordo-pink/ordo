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

import { LOCALE } from "@ordo-pink/i18n"
import { rickroll } from "@ordo-pink/rickroll"
import { routary } from "@ordo-pink/routary"
import { routary_cors } from "@ordo-pink/routary-cors"

import type { ServerID } from "./backend-server-id.types"
import { handle_get_session } from "./handlers/session/get-session.handler"
import { handle_get_user_by_handle } from "./handlers/user/get-user-by-handle.handler"
import { handle_get_user_by_id } from "./handlers/user/get-user-by-id.handler"
import { handle_invalidate_session } from "./handlers/session/invalidate.handler"
import { handle_refresh_session } from "./handlers/session/refresh-session.handler"
// import { handle_update_user } from "./handlers/user/update-user.handler"

// TODO Global stats when API is ready
// TODO Custom handlers for updating email & handle + disallow editing them in PATCH
export const create_backend_server_id = (chamber: ServerID.Params) =>
	routary
		.http<ServerID.Fuel>({ ...chamber, status: 200, headers: new Headers(), request_language: LOCALE.ENGLISH })
		.get("/session", handle_get_session)
		.post("/session", handle_refresh_session)
		.delete("/session", handle_invalidate_session)

		.get("/users/:user_id", handle_get_user_by_id)
		.get("/users/handle/:user_handle", handle_get_user_by_handle)
		// .patch("/users/:user_id", handle_update_user)
		// .delete("/users/:user_id", handle_delete_user)

		.get("/healthcheck", () => new Response("OK")) // TODO Extract to lib

		.use(
			routary_cors({
				allow_origin: chamber.allow_origin,
				allow_headers: ["content-type", "x-device"],
				allow_credentials: true,
			}),
		)

		.start(() => rickroll)
