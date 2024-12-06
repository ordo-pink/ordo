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
import { type TAuthJWT, type TTokenService } from "@ordo-pink/backend-service-token"
import { type TUserService, UserService } from "@ordo-pink/backend-service-user"
import { authenticate0, parse_body0 } from "@ordo-pink/backend-utils"
import { from_option0, prop } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { type TNotificationService } from "@ordo-pink/backend-service-offline-notifications"

import { create_confirmation_url } from "../fns/create-confirmation-url.fn"
import { get_body_email0 } from "../fns/getters.fn"

export const update_email0: TFn = (ctx, { user_service, notification_service, token_service, website_host }) =>
	Oath.Merge({
		token: authenticate0(ctx, token_service),
		body: parse_body0<Routes.ID.UpdateEmail.RequestBody>(ctx),
	})
		.pipe(Oath.ops.chain(extract_ctx0(user_service)))
		.pipe(Oath.ops.chain(update_user_email0(user_service)))
		.pipe(Oath.ops.tap(send_notification(notification_service, website_host)))
		.pipe(Oath.ops.map(prop("user")))
		.pipe(Oath.ops.map(UserService.serialise))
		.pipe(Oath.ops.map(body => ({ status: 200, body })))

// --- Internal ---

type TParams = {
	user_service: TUserService
	notification_service: TNotificationService
	token_service: TTokenService
	website_host: string
}
type TFn = (
	ctx: Context,
	params: TParams,
) => Oath<Routes.ID.UpdateEmail.Response, TRrr<"EIO" | "EINVAL" | "ENOENT" | "EEXIST" | "EACCES">>
type TCtx = { user: User.InternalUser; email: string }

const LOCATION = "update_email"

const enoent = RRR.codes.enoent(LOCATION)

type P = { body: Routes.ID.UpdateEmail.RequestBody; token: TAuthJWT }
const extract_ctx0 =
	(user_service: TUserService) =>
	({ body: { email }, token: { payload } }: P) =>
		Oath.Merge({
			user: user_service
				.get_by_id(payload.sub)
				.pipe(Oath.ops.chain(from_option0(() => enoent(`extract_ctx -> sub: ${payload.sub}`)))),
			email: get_body_email0(email),
		})

const update_user_email0 = (user_service: TUserService) => (ctx: TCtx) =>
	user_service.update_email(ctx.user.id, ctx.email).pipe(Oath.ops.map(code => ({ ...ctx, code })))

const send_notification =
	(notification_service: TNotificationService, website_host: string) =>
	(ctx: TCtx & { code: User.InternalUser["email_code"] }) =>
		notification_service.email_changed({
			to: { email: ctx.user.email, name: ctx.user.first_name },
			new_email: ctx.email,
			old_email: ctx.user.email,
			confirmation_url: create_confirmation_url(website_host, ctx.email as Ordo.User.Current.Instance["email"], ctx.code),
		})
