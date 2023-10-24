// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { UserService } from "@ordo-pink/backend-service-user"
import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { Middleware } from "koa"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"
import { sendError } from "@ordo-pink/backend-utils"
import { JTI, SUB } from "@ordo-pink/wjwt"

export type Params = { userService: UserService; tokenService: TTokenService }
export type Fn = (params: Params) => Middleware

export const handleRefreshToken: Fn =
	({ tokenService, userService }) =>
	async ctx =>
		Oath.all({
			sub:
				(ctx.cookies.get("sub") as SUB) ??
				Oath.reject(HttpError.BadRequest("Missing required cookies")),
			prevJti:
				(ctx.cookies.get("jti") as JTI) ??
				Oath.reject(HttpError.BadRequest("Missing required cookies")),
		})
			.chain(({ sub, prevJti }) =>
				tokenService.persistenceStrategy
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
					.chain(() =>
						userService.getById(sub).rejectedMap(() => HttpError.Forbidden("User not found")),
					)
					.chain(user =>
						tokenService
							.createPair({
								sub,
								prevJti,
								data: {
									fms: user.maxUploadSize,
									lim: user.fileLimit,
									sbs: user.subscription,
								},
							})
							.rejectedMap(HttpError.from)
							.chain(tokens =>
								Oath.of(new Date(Date.now() + tokens.exp))
									.tap(expires =>
										ctx.response.set(
											"Set-Cookie",
											`jti=${tokens.jti}; Expires=${expires}; SameSite=Lax; Path=/; HttpOnly;`,
										),
									)
									.map(expires => ({
										accessToken: tokens.tokens.access,
										sub: tokens.sub,
										jti: tokens.jti,
										fileLimit: user.fileLimit,
										subscription: user.subscription,
										maxUploadSize: user.maxUploadSize,
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
