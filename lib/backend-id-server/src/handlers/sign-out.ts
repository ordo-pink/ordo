// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TTokenService, TokenRecord } from "@ordo-pink/backend-token-service"
import type { Middleware } from "koa"
import type { UserService } from "@ordo-pink/backend-user-service"
import { useBearerAuthorization } from "@ordo-pink/backend-utils"

type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { sub, jti } = payload

		const tokenMap = await tokenService.repository
			.getTokenRecord(sub)
			.fix(() => ({} as TokenRecord))
			.toPromise()

		if (!tokenMap || !tokenMap[jti]) {
			return ctx.throw(403, "Invalid or outdated token")
		}

		await tokenService.repository.removeToken(sub, jti).toPromise()

		ctx.cookies.set("jti", null)
		ctx.cookies.set("sub", null)

		ctx.response.status = 204
	}
