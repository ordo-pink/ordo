// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Context, Middleware } from "#x/oak@v12.6.0/mod.ts"
import type { TTokenService } from "#lib/token-service/mod.ts"
import type { UserService } from "#lib/user-service/mod.ts"

import { ResponseError } from "#lib/be-use/mod.ts"
import { useBody } from "#lib/be-use/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#lib/tau/mod.ts"

// Public -----------------------------------------------------------------------------------------

type Body = { email?: string; password?: string }
type Params = { userService: UserService; tokenService: TTokenService.TokenService }
type Fn = (params: Params) => Middleware

export const handleSignIn: Fn =
	({ userService, tokenService }) =>
	ctx =>
		Oath.from(() => useBody<Body>(ctx))
			.chain(({ email, password }) =>
				Oath.all({ email: Oath.fromNullable(email), password: Oath.fromNullable(password) })
					.rejectedMap(ResponseError.create(400, "Invalid body content"))
					.chain(({ email, password }) =>
						Oath.all({
							user: userService.getByEmail(email),
							ok: userService.comparePassword(email, password),
						})
					)
					.bimap(ResponseError.create(404, "User not found"), prop("user"))
			)
			.chain(user =>
				Oath.of({ sub: user.id, uip: ctx.request.ip }).chain(({ sub, uip }) =>
					tokenService.createTokens({ sub, uip })
				)
			)
			.chain(tokens =>
				Oath.all([
					setSignInCookie("jti", tokens.jti, tokens.exp, ctx),
					setSignInCookie("sub", tokens.sub, tokens.exp, ctx),
				]).map(() => tokens)
			)
			.fork(ResponseError.send(ctx), ({ access, jti, sub }) => {
				ctx.response.body = { accessToken: access, jti, sub }
			})

// Internal ---------------------------------------------------------------------------------------

const setSignInCookie = (
	name: "sub" | "jti",
	value: string,
	exp: TTokenService.EXP,
	ctx: Context
) =>
	ctx.cookies.set(name, value, {
		httpOnly: true,
		sameSite: "lax",
		expires: new Date(Date.now() + exp),
	})
