// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { TokenDict, TokenService } from "#lib/token-service/mod.ts"
import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"
import type { UserService } from "#lib/user-service/mod.ts"

import { useBearerAuthorization } from "#lib/be-use/mod.ts"

type Params = { userService: UserService; tokenService: TokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx => {
		const { payload } = await useBearerAuthorization(ctx, tokenService)
		const { sub, jti } = payload

		const tokenMap = (await tokenService.getTokens(sub)).getOrElse(() => ({} as TokenDict))

		if (!tokenMap || !tokenMap[jti]) {
			return ctx.throw(403, "Unverified or outdated access token")
		}

		await tokenService.removeToken(sub, jti)

		await ctx.cookies.delete("jti")
		await ctx.cookies.delete("sub")

		ctx.response.status = 204
	}
