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

import {
	type TEmailContact,
	type TEmailStrategy,
	NotificationService,
} from "@ordo-pink/backend-service-offline-notifications"
import {
	type TPersistenceStrategyToken,
	type TTokenServiceOptions,
	TokenService,
} from "@ordo-pink/backend-service-token"
import { type TPersistenceStrategyUser, UserService } from "@ordo-pink/backend-service-user"
import { type TLogger } from "@ordo-pink/logger"
import { create_koa_server, send_error, send_success } from "@ordo-pink/backend-utils"

import { get_account0 } from "./handlers/get-account.handler"
import { update_info0 } from "./handlers/update-info.handler"
import { handleChangeEmail } from "./handlers/change-email.handler"
import { handleChangePassword } from "./handlers/change-password.handler"
import { handleConfirmEmail } from "./handlers/confirm-email.handler"
import { refresh_token0 } from "./handlers/refresh-token.handler"
import { sign_in0 } from "./handlers/sign-in.handler"
import { sign_out0 } from "./handlers/sign-out.handler"
import { sign_up0 } from "./handlers/sign-up.handler"
import { get_by_email0 } from "./handlers/get-public-by-email.handler"
import {
	handleUserInfoByID as handleUserInfoByID,
	get_by_id0,
} from "./handlers/get-public-by-id.handler"
import { verify_token0 } from "./handlers/verify-token.handler"
import { handle_get_public_by_handle0 as get_by_handle0 } from "./handlers/get-public-by-handle.handler"
import { Oath } from "@ordo-pink/oath"
import { TRrr } from "@ordo-pink/data"
import { Context } from "koa"

export type CreateIDServerFnParams = {
	user_persistence_strategy: TPersistenceStrategyUser
	token_persistence_strategy: TPersistenceStrategyToken
	email_strategy: TEmailStrategy
	origin: string | string[]
	logger: TLogger
	website_host: string
	notification_sender: Required<TEmailContact>
	token_service_options: TTokenServiceOptions
}

// TODO: Move to env
const social_links = {} as Record<string, string>
const support_channels = {} as Record<string, string>

export const createIDServer = ({
	user_persistence_strategy,
	token_persistence_strategy,
	email_strategy,
	origin,
	logger,
	website_host,
	notification_sender,
	token_service_options,
}: CreateIDServerFnParams) => {
	const user_service = UserService.of(user_persistence_strategy)
	const notification_service = NotificationService.of({
		email_strategy: email_strategy,
		sender: notification_sender,
		from: notification_sender,
		social_links,
		support_channels,
	})

	const token_service = TokenService.of(token_persistence_strategy, token_service_options)

	const Params = {
		user_service,
		token_service,
		notification_service,
		website_host,
		logger,
	}

	const exec =
		(f: (ctx: Context, params: typeof Params) => Oath<{ status: number; body?: any }, TRrr>) =>
		(ctx: Context) =>
			f(ctx, Params).invoke(o => o.fork(send_error({ ctx, logger }), send_success({ ctx })))

	return create_koa_server({
		origin,
		logger,
		server_name: "id",
		extend_router: router =>
			// TODO: Check if method satisfies required type
			router
				.get("/users/handle/:handle" satisfies Routes.ID.GetUserByHandle.Path, exec(get_by_handle0))
				.get("/users/email/:email" satisfies Routes.ID.GetUserByEmail.Path, exec(get_by_email0))
				.get("/users/id/:id" satisfies Routes.ID.GetUserByID.Path, exec(get_by_id0))
				.get("/account" satisfies Routes.ID.GetAccount.Path, exec(get_account0))
				.post("/account/sign-up" satisfies Routes.ID.SignUp.Path, exec(sign_up0))
				.post("/account/sign-in" satisfies Routes.ID.SignIn.Path, exec(sign_in0))
				.post("/account/sign-out" satisfies Routes.ID.SignOut.Path, exec(sign_out0))
				.post("/account/refresh-token" satisfies Routes.ID.RefreshToken.Path, exec(refresh_token0))
				.post("/account/verify-token" satisfies Routes.ID.VerifyToken.Path, exec(verify_token0))
				.patch("/account/update-info" satisfies Routes.ID.UpdateInfo.Path, exec(update_info0))
				.patch(
					"/account/confirm-email" satisfies Routes.ID.ConfirmEmail.Path,
					handleConfirmEmail(Params),
				)
				.patch(
					"/account/update-email" satisfies Routes.ID.UpdateEmail.Path,
					handleChangeEmail(Params),
				)
				// .patch("/account/update-handle", handleChangeEmail(ctx))
				.patch(
					"/account/update-password" satisfies Routes.ID.UpdatePassword.Path,
					handleChangePassword(Params),
				),

		// .post("/send-forgot-password-email/:email", () => {})
		// .post("/restore-password", () => {})
		// .post("/reset-password", () => {})
	})
}
