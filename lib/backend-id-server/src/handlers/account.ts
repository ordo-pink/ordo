// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Middleware } from "#x/oak@v12.6.0/mod.ts"
import type { TTokenService } from "#lib/token-service/mod.ts"
import type { UserService } from "#lib/user-service/mod.ts"

import { ResponseError, useBearerAuthorization } from "#lib/backend-utils/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { prop } from "#ramda"

type Params = { tokenService: TTokenService; userService: UserService }
type Fn = (params: Params) => Middleware

export const handleAccount: Fn =
	({ tokenService, userService }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, tokenService))
			.map(prop("sub"))
			.chain(id => userService.getById(id).rejectedMap(ResponseError.create(404, "User not found")))
			.fork(ResponseError.send(ctx), user => {
				ctx.response.body = user
			})
