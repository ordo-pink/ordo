// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "koa"
import type { PublicUser, UserService } from "@ordo-pink/backend-user-service"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import { authenticate0, sendError } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"

// --- Public ---

export type Params = { tokenService: TTokenService; userService: UserService }
export type Fn = (params: Params) => Middleware

export const handleUserInfo: Fn =
	({ tokenService, userService }) =>
	ctx =>
		authenticate0(ctx, tokenService)
			.map(() => ctx.params.email)
			.chain(e =>
				userService.getUserInfo(e).rejectedMap(() => HttpError.NotFound("User not found")),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
