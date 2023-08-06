// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { UserService } from "#lib/backend-user-service/mod.ts"
import type { TTokenService } from "#lib/backend-token-service/mod.ts"
import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"

export type Params = { userService: UserService; tokenService: TTokenService }
export type Fn = (params: Params) => Middleware

export const handleRefreshToken: Fn =
	({ tokenService }) =>
	async ctx => {
		const prevJti = await ctx.cookies.get("jti")
		const sub = await ctx.cookies.get("sub")

		if (!prevJti || !sub) return ctx.throw(400, "Missing required cookies")

		const isTokenValid = await tokenService.verifyRefreshToken(sub)

		if (!isTokenValid) return ctx.throw(403, "Invalid or outdated token")

		const uip = ctx.request.ip

		const { access, jti, exp } = await tokenService.createTokens({ sub, uip, prevJti }).toPromise()

		await ctx.cookies.set("jti", jti, {
			httpOnly: true,
			sameSite: "lax",
			expires: new Date(Date.now() + exp),
		})

		await ctx.cookies.set("sub", sub, {
			httpOnly: true,
			sameSite: "lax",
			expires: new Date(Date.now() + exp),
		})

		ctx.response.body = { accessToken: access, refreshToken: jti, userId: sub }
	}
