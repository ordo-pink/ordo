// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { UserService } from "@ordo-pink/backend-user-service"

import { ResponseError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { prop } from "ramda"

type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleAccount: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, tokenService))
			.map(prop("payload"))
			.map(prop("sub"))
			.chain(id => userService.getById(id).rejectedMap(ResponseError.create(404, "User not found")))
			.fork(ResponseError.send(ctx), user => {
				ctx.response.body = {
					success: true,
					result: user,
				}
			})
