// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"
import type { TokenService } from "#lib/token-service/mod.ts"
import type { UserService } from "#lib/user-service/mod.ts"

import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { okpwd } from "#lib/okpwd/mod.ts"
import { useBody } from "#lib/be-use/mod.ts"

type Body = { email?: string; password?: string }
type Params = { userService: UserService; tokenService: TokenService }
type Fn = (params: Params) => Middleware

// TODO: Rewrite with Oath
export const handleSignUp: Fn =
	({ userService, tokenService }) =>
	async ctx => {
		const { email, password } = await useBody<Body>(ctx)

		if (!email || !isEmail(email, {})) {
			return ctx.throw(400, "Invalid email")
		}

		const user = await userService.getByEmail(email).fork(
			() => null,
			user => user
		)

		if (user) {
			return ctx.throw(409, "User with this email already exists")
		}

		const validatePassword = okpwd()
		const error = validatePassword(password)

		if (error) {
			return ctx.throw(400, error)
		}

		try {
			const newUser = await userService.createUser(email, password!).toPromise()

			const sub = newUser.id
			const uip = ctx.request.ip

			const { jti, exp } = await tokenService.createRefreshToken(sub, uip)
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
		} catch (e) {
			console.log(e)

			ctx.throw(409, "User with this email already exists")
		}
	}
