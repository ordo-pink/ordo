// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { TTokenService } from "@ordo-pink/backend-token-service"
import { UserService } from "@ordo-pink/backend-user-service"
import { sendError, authenticate0, parseBody0 } from "@ordo-pink/backend-utils"
import { User } from "@ordo-pink/frontend-core"
import { Oath } from "@ordo-pink/oath"
import { HttpError } from "@ordo-pink/rrr"
import { isString } from "@ordo-pink/tau"
import { Middleware } from "koa"

type Body = Pick<User.PublicUser, "firstName" | "lastName">
type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleChangeAccountInfo: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.all({
			body: parseBody0<Body>(ctx).chain(({ firstName, lastName }) =>
				Oath.fromBoolean(
					() => isString(firstName) || isString(lastName),
					() => ({ firstName, lastName }),
					() => HttpError.BadRequest("Invalid body"),
				),
			),
			authorization: authenticate0(ctx, tokenService),
		})
			.chain(({ body, authorization }) =>
				userService
					.getById(authorization.payload.sub)
					.rejectedMap(() => HttpError.NotFound("User not found"))
					.chain(user =>
						userService
							.update(user.id, { firstName: body.firstName, lastName: body.lastName })
							.rejectedMap(() => HttpError.NotFound("User not found")),
					),
			)
			.fork(sendError(ctx), result => {
				ctx.response.body = { success: true, result }
			})
