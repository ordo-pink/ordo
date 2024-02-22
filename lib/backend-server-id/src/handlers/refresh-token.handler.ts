// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
