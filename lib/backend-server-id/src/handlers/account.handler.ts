// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"
import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { UserService } from "@ordo-pink/backend-service-user"
import { prop } from "ramda"
import { sendError, authenticate0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"

type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleAccount: Fn =
	({ tokenService, userService }) =>
	ctx =>
		authenticate0(ctx, tokenService)
			.map(prop("payload"))
			.map(prop("sub"))
			.chain(id => userService.getById(id).rejectedMap(() => HttpError.NotFound("User not found")))
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
