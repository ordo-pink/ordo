// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"
import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { UserService } from "@ordo-pink/backend-service-user"
import { sendError, parseBody0 } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { prop } from "ramda"
import { HttpError } from "@ordo-pink/rrr"
import { TOfflineNotificationService } from "@ordo-pink/backend-service-offline-notification"

// --- Public ---

type Body = { email?: string; password?: string }
type Params = {
	userService: UserService
	tokenService: TTokenService
	emailService: TOfflineNotificationService
}
type Fn = (params: Params) => Middleware

export const handleSignIn: Fn =
	({ userService, tokenService, emailService }) =>
	ctx =>
		parseBody0<Body>(ctx)
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
				Oath.of({ sub: user.id })
					.chain(({ sub }) =>
						tokenService
							.createPair({ sub })
							.rejectedMap(HttpError.from)
							.chain(tokens =>
								Oath.of(new Date(Date.now() + tokens.exp))
									.tap(expires => {
										ctx.response.set(
											"Set-Cookie",
											`jti=${tokens.jti}; Expires=${expires}; SameSite=Lax; Path=/; HttpOnly;`,
										)
										ctx.response.set(
											"Set-Cookie",
											`sub=${tokens.sub}; Expires=${expires}; SameSite=Lax; Path=/; HttpOnly;`,
										)
									})
									.map(expires => ({
										accessToken: tokens.tokens.access,
										sub: tokens.sub,
										jti: tokens.jti,
										fileLimit: tokens.lim,
										subscription: tokens.sbs,
										maxUploadSize: tokens.fms,
										expires,
									})),
							),
					)
					.tap(() =>
						emailService.sendSuccessfulSignInNotification({
							email: user.email,
							name: user.firstName ?? "",
							ip: ctx.request.ip,
						}),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
