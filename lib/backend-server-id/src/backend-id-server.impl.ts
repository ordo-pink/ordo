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

import { Oath, invokers0 } from "@ordo-pink/oath"
import { create_koa_server, send_error, send_success } from "@ordo-pink/backend-utils"
import { NotificationService } from "@ordo-pink/backend-service-offline-notifications"
import { TokenService } from "@ordo-pink/backend-service-token"
import { UserService } from "@ordo-pink/backend-service-user"

import type * as Types from "./types"
import { confirm_email0 } from "./handlers/confirm-email.handler"
import { get_account0 } from "./handlers/get-account.handler"
import { get_by_email0 } from "./handlers/get-public-by-email.handler"
import { get_by_handle0 } from "./handlers/get-public-by-handle.handler"
import { get_by_id0 } from "./handlers/get-public-by-id.handler"
import { sign_in0 } from "./handlers/sign-in.handler"
import { sign_out0 } from "./handlers/sign-out.handler"
import { sign_up0 } from "./handlers/sign-up.handler"
import { token_refresh0 } from "./handlers/token-refresh.handler"
import { token_verify0 } from "./handlers/token-verify.handler"
import { update_email0 } from "./handlers/update-email.handler"
import { update_handle0 } from "./handlers/update-handle.handler"
import { update_info0 } from "./handlers/update-info.handler"
import { update_password0 } from "./handlers/update-password.handler"

// TODO: Move to env
const social_links = {} as Record<string, string>
const support_channels = {} as Record<string, string>

export const create_id_server = async ({
	user_persistence_strategy,
	token_persistence_strategy,
	email_strategy,
	origin,
	logger,
	website_host,
	notification_sender,
	token_service_options,
}: Types.TCreateIDServerFnParams) => {
	const token_service = TokenService.of(token_persistence_strategy, token_service_options)
	const user_service = UserService.of(user_persistence_strategy)
	const notification_service = NotificationService.of({
		email_strategy,
		sender: notification_sender,
		social_links,
		support_channels,
	})

	const params: Types.THandlerParams = {
		user_service,
		token_service,
		notification_service,
		website_host,
		logger,
	}

	await user_service.migrate().invoke(
		invokers0.or_else(() => {
			logger.error(`Failed to migrate users to v${UserService.ENTITY_VERSION}`)
			process.exit(1)
		}),
	)

	const execute_handler =
		(
			f: (
				ctx: Context,
				params: Types.THandlerParams,
			) => Oath<{ status: number; body?: any }, Ordo.Rrr>,
		) =>
		(ctx: Context) =>
			f(ctx, params).invoke(o => o.fork(send_error({ ctx, logger }), send_success({ ctx })))

	return create_koa_server({
		origin,
		logger,
		server_name: "ID",
		extend_router: router =>
			// TODO: Check if method satisfies required type
			router
				.get(
					"/users/handle/:handle" satisfies Ordo.Routes.ID.GetUserByHandle.Path,
					execute_handler(get_by_handle0),
				)
				.get(
					"/users/email/:email" satisfies Ordo.Routes.ID.GetUserByEmail.Path,
					execute_handler(get_by_email0),
				)
				.get("/users/id/:id" satisfies Ordo.Routes.ID.GetUserByID.Path, execute_handler(get_by_id0))
				.get("/account" satisfies Ordo.Routes.ID.GetAccount.Path, execute_handler(get_account0))
				.post("/account/sign-up" satisfies Ordo.Routes.ID.SignUp.Path, execute_handler(sign_up0))
				.post("/account/sign-in" satisfies Ordo.Routes.ID.SignIn.Path, execute_handler(sign_in0))
				.post("/account/sign-out" satisfies Ordo.Routes.ID.SignOut.Path, execute_handler(sign_out0))
				.post(
					"/account/refresh-token" satisfies Ordo.Routes.ID.RefreshToken.Path,
					execute_handler(token_refresh0),
				)
				.post(
					"/account/verify-token" satisfies Ordo.Routes.ID.VerifyToken.Path,
					execute_handler(token_verify0),
				)
				.patch(
					"/account/confirm-email" satisfies Ordo.Routes.ID.ConfirmEmail.Path,
					execute_handler(confirm_email0),
				)
				.patch(
					"/account/info" satisfies Ordo.Routes.ID.UpdateInfo.Path,
					execute_handler(update_info0),
				)
				.patch(
					"/account/email" satisfies Ordo.Routes.ID.UpdateEmail.Path,
					execute_handler(update_email0),
				)
				.patch(
					"/account/handle" satisfies Ordo.Routes.ID.UpdateHandle.Path,
					execute_handler(update_handle0),
				)
				.patch(
					"/account/password" satisfies Ordo.Routes.ID.UpdatePassword.Path,
					execute_handler(update_password0),
				),

		// TODO: Forgot password
	})
}
