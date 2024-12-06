/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { type Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/managers"
import { type TAuthJWT, type TTokenService } from "@ordo-pink/backend-service-token"
import { authenticate0, parse_body0 } from "@ordo-pink/backend-utils"
import { Oath } from "@ordo-pink/oath"
import { TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TUserService } from "@ordo-pink/backend-service-user"
import { from_option0 } from "@ordo-pink/tau"

import { create_auth_token0 } from "../fns/create-auth-token.fn"
import { token_result_to_response_body } from "../fns/token-result-to-response-body.fn"

export const update_password0: TFn = (ctx, { token_service, user_service }) =>
	Oath.Merge({
		token: authenticate0(ctx, token_service),
		body: parse_body0<Routes.ID.UpdatePassword.RequestBody>(ctx, "object"),
	})
		.pipe(Oath.ops.chain(extract_ctx0(user_service)))
		.pipe(Oath.ops.chain(update_user_password0(user_service)))
		.pipe(Oath.ops.chain(drop_active_sessions0(token_service)))
		.pipe(Oath.ops.chain(create_auth_token0(token_service)))
		.pipe(Oath.ops.map(token_result_to_response_body))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

type TParams = {
	token_service: TTokenService
	user_service: TUserService
	notification_service: TNotificationService
}
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.UpdatePassword.Response, TRrr<"EIO" | "ENOENT" | "EINVAL" | "EACCES">>
type TRequest = { token: TAuthJWT; body: Routes.ID.UpdatePassword.RequestBody }
type TCtx = { old_password: string; new_password: string; user: User.InternalUser }

const LOCATION = "update_password"

const enoent = RRR.codes.enoent(LOCATION)
const einval = RRR.codes.einval(LOCATION)

const extract_ctx0 =
	(user_service: TUserService) =>
	({ token: { payload }, body: { old_password, new_password } }: TRequest) =>
		Oath.Merge({
			user: user_service
				.get_by_id(payload.sub)
				.pipe(Oath.ops.chain(from_option0(() => enoent(`extract_ctx -> sub: ${payload.sub}`)))),
			old_password: Oath.FromNullable(old_password, () => einval("extract_ctx -> no old_password")),
			new_password: Oath.FromNullable(new_password, () => einval("extract_ctx -> no new_password")),
		}).pipe(
			Oath.ops.chain(ctx =>
				user_service
					.compare_password(ctx.user.email, ctx.old_password)
					.pipe(Oath.ops.chain(valid => Oath.If(valid)))
					.pipe(Oath.ops.rejected_map(() => enoent("extract_ctx -> no user")))
					.pipe(Oath.ops.map(() => ctx)),
			),
		)

const update_user_password0 = (user_service: TUserService) => (ctx: TCtx) =>
	user_service.update_password(ctx.user.id, ctx.new_password).pipe(Oath.ops.map(() => ctx))

const drop_active_sessions0 = (token_service: TTokenService) => (ctx: TCtx) =>
	token_service.strategy.remove_tokens(ctx.user.id).pipe(Oath.ops.map(() => ctx.user))
