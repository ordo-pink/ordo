// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { UserService } from "#lib/user-service/mod.ts"
import type { TokenService } from "#lib/token-service/mod.ts"
import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"

export type Params = { userService: UserService; tokenService: TokenService }
export type Fn = (params: Params) => Middleware

export const handleRefreshToken: Fn =
	({ tokenService }) =>
	async ctx => {
		const oldJti = await ctx.cookies.get("jti")
		const sub = await ctx.cookies.get("sub")

		if (!oldJti || !sub) return ctx.throw(400, "Missing required cookies")

		const isTokenValid = await tokenService.verifyRefreshToken(sub, oldJti)

		if (!isTokenValid) return ctx.throw(403, "Invalid or outdated token")

		const ip = ctx.request.ip

		const { jti, exp } = await tokenService.createRefreshToken(sub, ip)
		const accessToken = await tokenService.createAccessToken(jti, sub)

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

		ctx.response.body = { accessToken, refreshToken: jti, userId: sub }
	}
