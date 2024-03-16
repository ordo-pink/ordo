// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import type { Middleware } from "koa"
import type { UserService } from "@ordo-pink/backend-service-user"
import type { TTokenService } from "@ordo-pink/backend-service-token"
import { sendError } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

export type Params = { tokenService: TTokenService; userService: UserService }
export type Fn = (params: Params) => Middleware

export const handleUserInfoByFSID: Fn =
	({ userService }) =>
	ctx =>
		Oath.of(ctx.params.fsid)
			.chain(fsid =>
				userService
					.getById(fsid)
					.map(user => userService.serializePublic(user))
					.rejectedMap(() => HttpError.NotFound("User not found")),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
