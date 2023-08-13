// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "#x/oak@v12.6.0/middleware.ts"
import type { TDataService } from "#lib/backend-data-service/mod.ts"
import type { TTokenService } from "#lib/backend-token-service/mod.ts"
import type { UserService } from "#lib/backend-user-service/mod.ts"

import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { okpwd } from "#lib/okpwd/mod.ts"
import { useBody } from "#lib/backend-utils/mod.ts"

type Body = { email?: string; password?: string }
type Params = {
	userService: UserService
	tokenService: TTokenService
	dataService: TDataService<ReadableStream>
}
type Fn = (params: Params) => Middleware

// TODO: Rewrite with Oath
export const handleSignUp: Fn =
	({ userService, tokenService, dataService }) =>
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
			const { access, jti, exp } = await tokenService.createTokens({ sub, uip }).toPromise()
			const expires = new Date(Date.now() + exp)

			await dataService.createUserSpace(sub).toPromise()
			await ctx.cookies.set("jti", jti, { httpOnly: true, sameSite: "lax", expires })
			await ctx.cookies.set("sub", sub, { httpOnly: true, sameSite: "lax", expires })

			ctx.response.body = { accessToken: access, refreshToken: jti, userId: sub }
		} catch (e) {
			console.log(e)

			ctx.throw(409, "User with this email already exists")
		}
	}
