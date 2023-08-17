// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Middleware } from "#x/oak@v12.6.0/mod.ts"
import type { UserService } from "#lib/backend-user-service/mod.ts"
import type { TTokenService } from "#lib/backend-token-service/mod.ts"

import { useBearerAuthorization } from "#lib/backend-utils/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

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