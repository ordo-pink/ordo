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
import { sendError, useBody } from "@ordo-pink/backend-utils"
import { Readable } from "stream"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"

type Body = { email?: string; password?: string }
type Params = {
	userService: UserService
	tokenService: TTokenService
	dataService: TDataService<Readable>
}
type Fn = (params: Params) => Middleware

// TODO: Rewrite with Oath
export const handleSignUp: Fn =
	({ userService, tokenService, dataService }) =>
	ctx =>
		useBody<Body>(ctx)
			.chain(body =>
				Oath.all({
					email: Oath.fromNullable(body.email)
						.map(validator.isEmail)
						.chain(isValidEmail =>
							Oath.fromBoolean(
								() => isValidEmail,
								() => body.email!,
								() => HttpError.BadRequest("Invalid email"),
							),
						),
					password: Oath.fromNullable(body.password)
						.map(okpwd())
						.chain(error =>
							Oath.fromBoolean(
								() => !error,
								() => body.password!,
								() => HttpError.BadRequest(error!),
							),
						),
				}),
			)
			.chain(({ email, password }) =>
				userService
					.getByEmail(email)
					.fix(() => null)
					.chain(user =>
						Oath.fromBoolean(
							() => !user,
							() => ({ email, password }),
							() => HttpError.Conflict("User with given email already exists"),
						),
					),
			)
			.chain(({ email, password }) =>
				userService.createUser(email, password).rejectedMap(HttpError.from),
			)
			.chain(user =>
				tokenService
					.createPair({ sub: user.id })
					.rejectedMap(HttpError.from)
					.chain(tokens =>
						dataService
							.createUserSpace(tokens.sub)
							.rejectedMap(HttpError.from)
							.map(() => new Date(Date.now() + tokens.exp))
							.tap(expires =>
								ctx.cookies.set("jti", tokens.jti, { httpOnly: true, sameSite: "lax", expires }),
							)
							.tap(expires =>
								ctx.cookies.set("sub", tokens.sub, { httpOnly: true, sameSite: "lax", expires }),
							)
							.map(expires => ({
								accessToken: tokens.tokens.access,
								sub: tokens.sub,
								jti: tokens.jti,
								expires,
							})),
					),
			)
			.fork(sendError(ctx), body => {
				ctx.response.status = 201
				ctx.response.body = body
			})
