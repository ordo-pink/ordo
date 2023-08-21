// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { UserService } from "@ordo-pink/backend-user-service"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { Middleware } from "koa"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"
import { prop } from "ramda"
import { sendError } from "@ordo-pink/backend-utils"

export type Params = { userService: UserService; tokenService: TTokenService }
export type Fn = (params: Params) => Middleware

// TODO: Also get sub and jti from body
export const handleRefreshToken: Fn =
	({ tokenService }) =>
	async ctx =>
		Oath.all({
			sub: ctx.cookies.get("jti") ?? Oath.reject("Missing required cookies"),
			prevJti: ctx.cookies.get("jti" ?? Oath.reject("Missing required cookies")),
		})
			.rejectedMap(message => HttpError.BadRequest(message))
			.chain(({ sub, prevJti }) =>
				tokenService.repository
					.getToken(sub, prevJti!)
					.rejectedMap(() => HttpError.NotFound("Token not found"))
					.chain(token =>
						Oath.fromNullable(token).rejectedMap(() => HttpError.Unauthorized("Token not found")),
					)
					.chain(token =>
						tokenService.verifyToken(token, "refresh").chain(valid =>
							Oath.fromBoolean(
								() => valid,
								() => token,
								() => HttpError.Forbidden("Invalid token"),
							),
						),
					)
					.chain(token =>
						tokenService
							.decode(token, "refresh")
							.chain(Oath.fromNullable)
							.rejectedMap(() => HttpError.Forbidden("Invalid token")),
					)
					.chain(token =>
						Oath.fromBoolean(
							() => token.payload.uip === ctx.request.ip,
							() => token,
							() => HttpError.Unauthorized("Invalid token"),
						),
					)
					.map(prop("payload"))
					.map(prop("uip"))
					.chain(uip =>
						tokenService
							.createPair({ sub, prevJti, uip })
							.rejectedMap(HttpError.from)
							.chain(tokens =>
								Oath.of(new Date(Date.now() + tokens.exp))
									.tap(expires =>
										ctx.cookies.set("jti", tokens.jti, {
											httpOnly: true,
											sameSite: "lax",
											expires,
										}),
									)
									.tap(expires =>
										ctx.cookies.set("sub", tokens.sub, {
											httpOnly: true,
											sameSite: "lax",
											expires,
										}),
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
			.fork(
				error => {
					ctx.cookies.set("jti", null)
					ctx.cookies.set("sub", null)

					sendError(ctx)(error)
				},
				result => {
					ctx.response.body = { success: true, result }
				},
			)
