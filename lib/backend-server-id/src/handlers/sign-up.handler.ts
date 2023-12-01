// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TTokenService } from "@ordo-pink/backend-service-token"
import type { UserService } from "@ordo-pink/backend-service-user"
import type { Middleware } from "koa"
import validator from "validator"
import { okpwd } from "@ordo-pink/okpwd"
import { sendError, parseBody0 } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"
import { TNotificationService } from "@ordo-pink/backend-service-offline-notifications"

type Body = { email?: string; password?: string }
type Params = {
	userService: UserService
	tokenService: TTokenService
	notificationService: TNotificationService
	websiteHost: string
}
type Fn = (params: Params) => Middleware

export const handleSignUp: Fn =
	({ userService, tokenService, notificationService, websiteHost }) =>
	ctx =>
		parseBody0<Body>(ctx)
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
						Oath.of(tokens)
							.map(() => new Date(Date.now() + tokens.exp))
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
					)
					.chain(tokens =>
						Oath.of(crypto.getRandomValues(new Uint32Array(3)).join(""))
							.chain(code => userService.update(tokens.sub, { code }))
							.tap(user =>
								notificationService.sendEmailConfirmationRequestEmail({
									email: user.email,
									confirmationUrl: `${websiteHost}/confirm-email?code=${user.code}&email=${user.email}`,
								}),
							)
							.bimap(
								() => HttpError.NotFound("User not found"),
								() => tokens,
							),
					),
			)
			.fork(sendError(ctx), body => {
				ctx.response.status = 201
				ctx.response.body = body
			})
