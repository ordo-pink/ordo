// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TTokenService, TokenRecord } from "@ordo-pink/backend-token-service"
import type { Middleware } from "koa"
import type { UserService } from "@ordo-pink/backend-user-service"
import { sendError, useBearerAuthorization } from "@ordo-pink/backend-utils"
import { prop } from "ramda"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"

type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx =>
		useBearerAuthorization(ctx, tokenService)
			.map(prop("payload"))
			.chain(({ sub, jti }) =>
				tokenService.repository
					.getToken(sub, jti)
					.chain(Oath.fromNullable)
					.rejectedMap(() => HttpError.Forbidden("Invalid token"))
					.chain(() => tokenService.repository.removeToken(sub, jti).fix(() => "OK" as const))
					.map(() => {
						ctx.cookies.set("jti", null)
						ctx.cookies.set("sub", null)
					}),
			)
			.fork(sendError(ctx), () => {
				ctx.response.status = 204
			})
