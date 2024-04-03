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

import { type Middleware } from "koa"
import validator from "validator"

import { parseBody0, sendError } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"
import { okpwd } from "@ordo-pink/okpwd"

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
									`jti=${tokens.jti}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
								)
								ctx.response.set(
									"Set-Cookie",
									`sub=${tokens.sub}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
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
								notificationService.sendSignUpNotification({
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
