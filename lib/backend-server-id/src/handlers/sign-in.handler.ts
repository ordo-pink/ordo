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
import { prop } from "ramda"

import { parseBody0, sendError } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type UserService } from "@ordo-pink/backend-service-user"

// --- Public ---

type Body = { email?: string; password?: string }
type Params = {
	userService: UserService
	tokenService: TTokenService
	notificationService: TNotificationService
}
type Fn = (params: Params) => Middleware

export const handleSignIn: Fn =
	({ userService, tokenService, notificationService }) =>
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
										ctx.response.set("Set-Cookie", [
											`jti=${tokens.jti}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
											`sub=${tokens.sub}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
										])
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
						notificationService.sendSignInNotification({
							to: { email: user.email, name: user.first_name },
							ip: ctx.get("x-forwarded-for") ?? ctx.request.ip,
						}),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
