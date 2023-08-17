// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TDataService } from "@ordo-pink/backend-data-service"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { UserService } from "@ordo-pink/backend-user-service"
import type { Middleware } from "koa"
import validator from "validator"
import { okpwd } from "@ordo-pink/okpwd"
import { useBody } from "@ordo-pink/backend-utils"

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

		if (!email || !validator.isEmail(email, {})) {
			return ctx.throw(400, "Invalid email")
		}

		const user = await userService.getByEmail(email).fork(
			() => null,
			user => user,
		)

		if (user) return ctx.throw(409, "User with this email already exists")

		const validatePassword = okpwd()
		const error = validatePassword(password)

		if (error) {
			return ctx.throw(400, error)
		}

		try {
			const newUser = await userService.createUser(email, password!).toPromise()

			const sub = newUser.id
			const uip = ctx.request.ip
			const { access, jti, exp } = await tokenService.createPair({ sub, uip }).toPromise()
			const expires = new Date(Date.now() + exp)

			await dataService.createUserSpace(sub).toPromise()

			ctx.cookies.set("jti", jti, { httpOnly: true, sameSite: "lax", expires })
			ctx.cookies.set("sub", sub, { httpOnly: true, sameSite: "lax", expires })

			ctx.response.body = {
				success: true,
				result: { accessToken: access, refreshToken: jti, userId: sub },
			}
		} catch (e) {
			console.log(e)

			ctx.throw(409, "User with this email already exists")
		}
	}
