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

import { Context } from "koa"

import { RRR, type TRrr } from "@ordo-pink/managers"
import { Oath } from "@ordo-pink/oath"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { type TTokenService } from "@ordo-pink/backend-service-token"
import { type TUserService } from "@ordo-pink/backend-service-user"
import { parse_body0 } from "@ordo-pink/backend-utils"

import { type TCreateAuthTokenResult, create_auth_token0 } from "../fns/create-auth-token.fn"
import { create_confirmation_url } from "../fns/create-confirmation-url.fn"
import { set_auth_cookie } from "../fns/auth-cookie.fn"
import { token_result_to_response_body } from "../fns/token-result-to-response-body.fn"

export const sign_up0: TFn = (ctx, { user_service, token_service, notification_service, website_host }) =>
	parse_body0<Routes.ID.SignUp.RequestBody>(ctx, "object")
		.pipe(Oath.ops.chain(extract_ctx0))
		.pipe(Oath.ops.chain(create_user0(user_service)))
		.pipe(Oath.ops.chain(create_auth_token0(token_service)))
		.pipe(Oath.ops.tap(({ user, expires, jti }) => set_auth_cookie(ctx, user.id, jti, expires)))
		.pipe(Oath.ops.tap(send_notification(notification_service, website_host)))
		.pipe(Oath.ops.map(token_result_to_response_body))
		.pipe(Oath.ops.map(body => ({ status: 201, body })))

// --- Internal ---

type Params = {
	user_service: TUserService
	token_service: TTokenService
	notification_service: TNotificationService
	website_host: string
}
type TFn = (ctx: Context, params: Params) => Oath<Routes.ID.SignUp.Response, TRrr<"EINVAL" | "EIO" | "EEXIST">>
type TCtx = { email: string; handle: string; password: string }

const LOCATION = "sign_up"

const einval = RRR.codes.einval(LOCATION)

// TODO: Move to utils

const extract_ctx0 = ({ email, handle, password }: Routes.ID.SignUp.RequestBody): Oath<TCtx, TRrr<"EINVAL">> =>
	Oath.Merge({
		email: Oath.FromNullable(email, () => einval("extract_ctx -> email: null")),
		handle: Oath.FromNullable(handle, () => einval("extract_ctx -> handle: null")),
		password: Oath.FromNullable(password, () => einval("extract_ctx -> password: null")),
	})

const create_user0 =
	(user_service: TUserService) =>
	({ email, password, handle }: TCtx) =>
		user_service.create(email, handle, password)

const send_notification =
	(notification_service: TNotificationService, website_host: string) =>
	({ user }: TCreateAuthTokenResult) =>
		notification_service.sign_up({
			to: { email: user.email },
			confirmation_url: create_confirmation_url(website_host, user.email, user.email_code),
		})
