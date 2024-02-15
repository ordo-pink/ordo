// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"

import { authenticate0, parseBody0, sendError } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { UserService } from "@ordo-pink/backend-service-user"
import { noop } from "@ordo-pink/tau"
import { okpwd } from "@ordo-pink/okpwd"

export type Body = { oldPassword?: string; newPassword?: string; repeatNewPassword?: string }
export type Params = { tokenService: TTokenService; userService: UserService }
export type Fn = (params: Params) => Middleware

export const handleChangePassword: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.all({
			auth: authenticate0(ctx, tokenService),
			body: parseBody0<Body>(ctx, "object"),
		})
			.chain(({ auth, body }) =>
				Oath.all({
					payload: auth.payload,
					oldPassword: Oath.of(body.oldPassword)
						.map(okpwd())
						.chain(e =>
							Oath.fromBoolean(
								() => !e,
								noop,
								() => HttpError.BadRequest(e ?? "Invalid new password"),
							),
						),
					newPassword: Oath.of(body.oldPassword)
						.map(okpwd())
						.chain(e =>
							Oath.fromBoolean(
								() => !e,
								noop,
								() => HttpError.BadRequest(e ?? "Invalid old password"),
							),
						)
						.chain(() =>
							Oath.fromBoolean(
								() => body.newPassword === body.repeatNewPassword,
								noop,
								() => HttpError.BadRequest("Passwords do not match"),
							),
						),
				})
					.chain(() =>
						userService
							.getById(auth.payload.sub)
							.rejectedMap(() => HttpError.NotFound("User not found")),
					)
					.chain(user =>
						userService
							.comparePassword(user.email, body.oldPassword!)
							.rejectedMap(() => HttpError.NotFound("User not found"))
							.chain(() =>
								userService
									.updateUserPassword(user, body.oldPassword!, body.newPassword!)
									.rejectedMap(error =>
										error && error instanceof Error
											? HttpError.from(error)
											: HttpError.NotFound(error ?? "User not found"),
									),
							)
							.chain(() =>
								tokenService.persistenceStrategy
									.removeTokenRecord(auth.payload.sub)
									.rejectedMap(HttpError.from),
							)
							.chain(() =>
								tokenService
									.createPair({ sub: auth.payload.sub })
									.rejectedMap(HttpError.from)
									.chain(tokens =>
										// TODO: Drop sessions other than the current one
										Oath.of(new Date(Date.now() + tokens.exp))
											.tap(expires => {
												ctx.response.set("Set-Cookie", [
													`jti=${tokens.jti}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
													`sub=${tokens.sub}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
												])
											})
											.map(expires => ({
												accessToken: tokens.tokens.access,
												sub: tokens.sub,
												jti: tokens.jti,
												expires,
											})),
									),
							),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
