// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
