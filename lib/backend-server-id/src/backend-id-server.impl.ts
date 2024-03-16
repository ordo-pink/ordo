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

import { TokenPersistenceStrategy, TokenService } from "@ordo-pink/backend-service-token"
import { UserPersistenceStrategy, UserService } from "@ordo-pink/backend-service-user"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { createServer } from "@ordo-pink/backend-utils"

import { handleChangeAccountInfo } from "./handlers/change-account-info.handler"
import { handleChangePassword } from "./handlers/change-password.handler"
import { handleRefreshToken } from "./handlers/refresh-token.handler"
import { handleVerifyToken } from "./handlers/verify-token.handler"
import { handleChangeEmail } from "./handlers/change-email.handler"
// import { handleUserInfoByEmail } from "./handlers/user-info-by-email.handler"
import { handleSignOut } from "./handlers/sign-out.handler"
import { handleAccount } from "./handlers/account.handler"
import { handleSignIn } from "./handlers/sign-in.handler"
import { handleSignUp } from "./handlers/sign-up.handler"
import { Algorithm } from "@ordo-pink/wjwt"
import {
	EmailContact,
	EmailStrategy,
	NotificationService,
} from "@ordo-pink/backend-service-offline-notifications"
import { handleUserInfoByFSID } from "./handlers/user-info-by-fsid.handler"
import { handleConfirmEmail } from "./handlers/confirm-email.handler"

export type CreateIDServerFnParams = {
	userRepository: UserPersistenceStrategy
	tokenRepository: TokenPersistenceStrategy
	emailStrategy: EmailStrategy
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	origin: string | string[]
	alg: Algorithm
	accessKeys: CryptoKeyPair
	refreshKeys: CryptoKeyPair
	logger?: Logger
	websiteHost: string
	notificationSender: EmailContact
}

export const createIDServer = async ({
	userRepository,
	tokenRepository,
	emailStrategy,
	origin,
	accessTokenExpireIn,
	refreshTokenExpireIn,
	accessKeys,
	refreshKeys,
	logger = ConsoleLogger,
	websiteHost,
	notificationSender,
	alg,
}: CreateIDServerFnParams) => {
	const userService = await UserService.of(userRepository)
	const notificationService = NotificationService.of({
		emailStrategy,
		websiteHost,
		sender: notificationSender,
	})

	const tokenService = TokenService.of({
		persistenceStrategy: tokenRepository,
		options: {
			accessTokenExpireIn,
			refreshTokenExpireIn,
			alg,
			keys: { access: accessKeys, refresh: refreshKeys },
			logger,
		},
	})

	const ctx = { userService, tokenService, notificationService, websiteHost }

	return createServer({
		origin,
		logger,
		serverName: "id",
		extendRouter: r =>
			r
				.post("/sign-up", handleSignUp(ctx))
				.post("/sign-in", handleSignIn(ctx))
				.post("/sign-out", handleSignOut(ctx))
				.post("/refresh-token", handleRefreshToken(ctx))
				.post("/confirm-email", handleConfirmEmail(ctx))
				.get("/account", handleAccount(ctx))
				// .get("/users/:email", handleUserInfoByEmail(ctx))
				.get("/users/:fsid", handleUserInfoByFSID(ctx))
				.patch("/change-account-info", handleChangeAccountInfo(ctx))
				.patch("/change-email", handleChangeEmail(ctx))
				.patch("/change-password", handleChangePassword(ctx))
				.post("/verify-token", handleVerifyToken(ctx)),
		// .post("/send-forgot-password-email/:email", () => {})
		// .post("/restore-password", () => {})
		// .post("/reset-password", () => {})
	})
}
