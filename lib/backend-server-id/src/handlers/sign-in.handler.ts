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

import { type Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/managers"
import { Oath } from "@ordo-pink/oath"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type TUserService } from "@ordo-pink/backend-service-user"
import { from_option0 } from "@ordo-pink/tau"
import { parse_body0 } from "@ordo-pink/backend-utils"

import { type TCreateAuthTokenResult, create_auth_token0 } from "../fns/create-auth-token.fn"
import { set_auth_cookie } from "../fns/auth-cookie.fn"
import { token_result_to_response_body } from "../fns/token-result-to-response-body.fn"

// --- Public ---

export const sign_in0: TFn = (ctx, { user_service, token_service, notification_service }) =>
	parse_body0<Routes.ID.SignIn.RequestBody>(ctx, "object")
		.pipe(Oath.ops.chain(extract_ctx0))
		.pipe(Oath.ops.chain(validate_ctx0(user_service)))
		.pipe(Oath.ops.chain(create_auth_token0(token_service)))
		.pipe(Oath.ops.tap(({ user, jti, expires }) => set_auth_cookie(ctx, user.id, jti, expires)))
		.pipe(Oath.ops.tap(send_notification(ctx, notification_service)))
		.pipe(Oath.ops.map(token_result_to_response_body))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

type TParams = {
	user_service: TUserService
	token_service: TTokenService
	notification_service: TNotificationService
}
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.SignIn.Response, TRrr<"ENOENT" | "EIO" | "EINVAL">>
type TCtx =
	| { email: string; handle?: string; password: string }
	| { email?: string; handle: string; password: string }

const LOCATION = "handle_sign_in"

const enoent = RRR.codes.enoent(LOCATION)
const einval = RRR.codes.einval(LOCATION)

const send_notification =
	(ctx: Context, notification_service: TNotificationService) =>
	({ user }: TCreateAuthTokenResult) =>
		notification_service.sign_in({
			to: { email: user.email, name: user.first_name },
			ip: ctx.get("x-forwarded-for") ?? ctx.request.ip,
		})

const extract_ctx0 = ({ email, handle, password }: Routes.ID.SignIn.RequestBody) =>
	Oath.Merge({
		email: Oath.FromNullable(email, () => einval("extract_ctx -> email: null")),
		password: Oath.FromNullable(password, () => einval("extract_ctx -> password: null")),
	}).fix(() =>
		Oath.Merge({
			handle: Oath.FromNullable(handle, () => einval("extract_ctx -> handle: null")),
			password: Oath.FromNullable(password, () => einval("extract_ctx -> password: null")),
		}),
	)

const validate_ctx0 =
	(user_service: TUserService) =>
	({ email, handle, password }: TCtx) =>
		Oath.Merge([
			email ? user_service.get_by_email(email) : user_service.get_by_handle(handle!),
			user_service.compare_password(email ? email : handle!, password),
		])
			.pipe(Oath.ops.map(([option]) => option))
			.pipe(
				Oath.ops.chain(
					from_option0(() =>
						enoent(`validate_ctx -> ${email ? "email" : "handle"}: ${email ?? handle}`),
					),
				),
			)
