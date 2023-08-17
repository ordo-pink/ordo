// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "#x/oak@v12.6.0/mod.ts"
import type { EXP, TTokenService } from "#lib/backend-token-service/mod.ts"
import type { UserService } from "#lib/backend-user-service/mod.ts"

import { ResponseError } from "#lib/backend-utils/mod.ts"
import { useBody } from "#lib/backend-utils/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"

// --- Public ---

type Body = { email?: string; password?: string }
type Params = { userService: UserService; tokenService: TTokenService }
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
						}),
					)
					.bimap(ResponseError.create(404, "User not found"), prop("user")),
			)
			// TODO: Drop previous token if it exists for given IP
			.chain(user =>
				Oath.of({ sub: user.id, uip: ctx.request.ip }).chain(({ sub, uip }) =>
					tokenService.createTokens({ sub, uip }),
				),
			)
			.chain(tokens =>
				Oath.all([
					setSignInCookie("jti", tokens.jti, tokens.exp, ctx),
					setSignInCookie("sub", tokens.sub, tokens.exp, ctx),
				]).map(() => tokens),
			)
			.fork(ResponseError.send(ctx), ({ access, jti, sub }) => {
				ctx.response.body = {
					success: true,
					result: { accessToken: access, jti, sub },
				}
			})

// --- Internal ---

const setSignInCookie = (name: "sub" | "jti", value: string, exp: EXP, ctx: Context) =>
	ctx.cookies.set(name, value, {
		httpOnly: true,
		sameSite: "lax",
		expires: new Date(Date.now() + exp),
	})
