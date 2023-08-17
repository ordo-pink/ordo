// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { UserService } from "@ordo-pink/backend-user-service"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { Middleware } from "koa"

export type Params = { userService: UserService; tokenService: TTokenService }
export type Fn = (params: Params) => Middleware

export const handleRefreshToken: Fn =
	({ tokenService }) =>
	async ctx => {
		// TODO: Also get sub and jti from body
		const prevJti = await ctx.cookies.get("jti")
		const sub = await ctx.cookies.get("sub")
		if (!prevJti || !sub) return ctx.throw(400, "Missing required cookies")

		const token = await tokenService.repository
			.getToken(sub, prevJti)
			.toPromise()
			.catch(() => null)

		if (!token) {
			ctx.cookies.set("jti", null)
			ctx.cookies.set("sub", null)

			return ctx.throw(403, "Invalid or outdated token")
		}

		const isTokenValid = await tokenService.verifyToken(token, "refresh").toPromise()

		if (!isTokenValid) {
			ctx.cookies.set("jti", null)
			ctx.cookies.set("sub", null)

			return ctx.throw(403, "Invalid or outdated token")
		}

		const decodedToken = await tokenService.decode(token, "refresh").toPromise()
		const uip = ctx.request.ip
		if (!decodedToken || decodedToken.payload.uip !== uip) {
			ctx.cookies.set("jti", null)
			ctx.cookies.set("sub", null)

			return ctx.throw(403, "Invalid or outdated token")
		}

		const { access, jti, exp } = await tokenService.createPair({ sub, uip, prevJti }).toPromise()
		const expires = new Date(Date.now() + exp)

		ctx.cookies.set("jti", jti, { httpOnly: true, sameSite: "lax", expires })
		ctx.cookies.set("sub", sub, { httpOnly: true, sameSite: "lax", expires })

		ctx.response.body = {
			success: true,
			result: { accessToken: access, jti, sub, exp },
		}
	}
