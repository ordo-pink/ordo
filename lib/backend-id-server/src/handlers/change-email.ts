// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Context, Middleware } from "koa"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { UserService } from "@ordo-pink/backend-user-service"
import type { User } from "@ordo-pink/backend-user-service"

import validator from "validator"
import { useBearerAuthorization, useBody } from "@ordo-pink/backend-utils"
import { sendError } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"

type Body = { email?: string }
type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleChangeEmail: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.all({
			token: useBearerAuthorization(ctx, tokenService),
			body: useBody<Body>(ctx),
		})
			.chain(({ token, body }) =>
				Oath.all({
					user: userService.getById(token.payload.sub),
					email: body.email,
				})
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(({ user, email }) =>
						Oath.fromNullable(email)
							.chain(email =>
								Oath.all([
									Oath.fromBoolean(
										() => validator.isEmail(email, {}),
										() => "OK" as const,
										() => false,
									).rejectedMap(() => HttpError.BadRequest("Invalid email")),
									Oath.fromBoolean(
										() => user.email !== email,
										() => "OK" as const,
										() => false,
									).rejectedMap(() => HttpError.BadRequest("This is your current email")),
									userService
										.getByEmail(email)
										.chain(() => Oath.reject())
										.fix(userExists =>
											Oath.fromBoolean(
												() => !userExists,
												() => "OK" as const,
												() => false,
											),
										)
										.rejectedMap(() => HttpError.Conflict("Email already taken")),
								]),
							)
							.map(() => ({ user, email: email! })),
					)
					.rejectedMap(() => HttpError.BadRequest("Invalid email")),
			)
			.chain(({ user, email }) =>
				userService
					.update(user.id, { email })
					.rejectedMap(() => HttpError.NotFound("User not found")),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
