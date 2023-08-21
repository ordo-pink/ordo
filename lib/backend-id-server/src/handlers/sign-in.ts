// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { UserService } from "@ordo-pink/backend-user-service"
import { sendError, useBody } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { prop } from "ramda"
import { HttpError } from "@ordo-pink/rrr"

// --- Public ---

type Body = { email?: string; password?: string }
type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignIn: Fn =
	({ userService, tokenService }) =>
	ctx =>
		useBody<Body>(ctx)
			.chain(({ email, password }) =>
				Oath.all({ email: Oath.fromNullable(email), password: Oath.fromNullable(password) })
					.rejectedMap(() => HttpError.BadRequest("Invalid body content"))
					.chain(({ email, password }) =>
						Oath.all({
							user: userService.getByEmail(email),
							ok: userService.comparePassword(email, password),
						}),
					)
					.bimap(() => HttpError.NotFound("User not found"), prop("user")),
			)
			.chain(user =>
				Oath.of({ sub: user.id, uip: ctx.request.ip }).chain(({ sub, uip }) =>
					tokenService
						.createPair({ sub, uip })
						.rejectedMap(HttpError.from)
						.chain(tokens =>
							Oath.of(new Date(Date.now() + tokens.exp))
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
				),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
