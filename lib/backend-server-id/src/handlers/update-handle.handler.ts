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

import { Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/data"
import { type TAuthJWT, type TTokenService } from "@ordo-pink/backend-service-token"
import { type TUserService, UserService } from "@ordo-pink/backend-service-user"
import { authenticate0, parse_body0 } from "@ordo-pink/backend-utils"
import { from_option0, prop } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"

import { get_body_handle0 } from "../fns/getters.fn"

export const update_handle0: TFn = (ctx, { user_service, token_service }) =>
	Oath.Merge({
		token: authenticate0(ctx, token_service),
		body: parse_body0<Routes.ID.UpdateHandle.RequestBody>(ctx),
	})
		.pipe(Oath.ops.chain(extract_ctx0(user_service)))
		.pipe(Oath.ops.chain(update_user_handle0(user_service)))
		.pipe(Oath.ops.map(prop("user")))
		.pipe(Oath.ops.map(UserService.serialise))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

type TParams = { user_service: TUserService; token_service: TTokenService }
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.UpdateHandle.Response, TRrr<"EIO" | "EINVAL" | "ENOENT" | "EEXIST" | "EACCES">>
type TCtx = { user: User.InternalUser; handle: string }

const LOCATION = "update_handle"

const enoent = RRR.codes.enoent(LOCATION)

type P = { body: Routes.ID.UpdateHandle.RequestBody; token: TAuthJWT }
const extract_ctx0 =
	(user_service: TUserService) =>
	({ body: { handle }, token: { payload } }: P) =>
		Oath.Merge({
			user: user_service
				.get_by_id(payload.sub)
				.pipe(Oath.ops.chain(from_option0(() => enoent(`extract_ctx -> sub: ${payload.sub}`)))),
			handle: get_body_handle0(handle),
		})

const update_user_handle0 = (user_service: TUserService) => (ctx: TCtx) =>
	user_service.update_handle(ctx.user.id, ctx.handle).pipe(Oath.ops.map(code => ({ ...ctx, code })))
