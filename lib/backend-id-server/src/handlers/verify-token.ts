// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "koa"
import type { UserService } from "@ordo-pink/backend-user-service"
import type { TTokenService } from "@ordo-pink/backend-token-service"
import { useBearerAuthorization } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

export type Params = { tokenService: TTokenService; userService: UserService }
export type Fn = (params: Params) => Middleware

export const handleVerifyToken: Fn =
	({ tokenService }) =>
	ctx =>
		Oath.from(() => useBearerAuthorization(ctx, tokenService))
			.chain(Oath.fromNullable)
			.fork(
				() => {
					ctx.response.body = {
						success: true,
						result: { valid: false },
					}
				},
				token => {
					ctx.response.body = { success: true, result: { valid: true, token } }
				}
			)
