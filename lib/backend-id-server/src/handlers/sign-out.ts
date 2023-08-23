// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { TTokenService } from "@ordo-pink/backend-token-service"
import type { Middleware } from "koa"
import type { UserService } from "@ordo-pink/backend-user-service"
import { sendError } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"

type Params = { userService: UserService; tokenService: TTokenService }
type Fn = (params: Params) => Middleware

export const handleSignOut: Fn =
	({ tokenService }) =>
	async ctx =>
		Oath.all({
			sub: Oath.fromNullable(ctx.cookies.get("sub")),
			jti: Oath.fromNullable(ctx.cookies.get("jti")),
		})
			.chain(({ sub, jti }) => tokenService.repository.removeToken(sub, jti))
			.fix(() => "OK")
			.map(() => {
				ctx.cookies.set("jti", "")
				ctx.cookies.set("sub", "")
			})
			.fork(sendError(ctx), () => {
				ctx.response.status = 204
			})
