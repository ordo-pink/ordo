// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"
import { sendError, parseBody0 } from "@ordo-pink/backend-utils"
import { HttpError } from "@ordo-pink/rrr"
import { Oath } from "@ordo-pink/oath"
import { UserService } from "@ordo-pink/backend-service-user"

type Body = { email?: string; code?: string }
type Params = { userService: UserService }
type Fn = (params: Params) => Middleware

export const handleConfirmEmail: Fn =
	({ userService }) =>
	ctx =>
		parseBody0<Body>(ctx, "object")
			.chain(({ email, code }) =>
				Oath.all({ email: Oath.fromNullable(email), code: Oath.fromNullable(code) }),
			)
			.chain(({ email, code }) =>
				userService
					.getByEmail(email)
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(
						Oath.ifElse(usr => usr.code === code, {
							onFalse: () => HttpError.NotFound("User not found"),
						}),
					)
					.chain(
						Oath.ifElse(usr => !usr.emailConfirmed, {
							onFalse: () => HttpError.Conflict("Subscription already on"),
						}),
					)
					.chain(usr =>
						userService
							.update(usr.id, { emailConfirmed: true, code: undefined })
							.rejectedMap(() => HttpError.NotFound("User not found")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
