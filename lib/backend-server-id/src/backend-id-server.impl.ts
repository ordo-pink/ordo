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

import { ConsoleLogger, type Logger } from "@ordo-pink/logger"
import {
	EmailContact,
	EmailStrategy,
	NotificationService,
} from "@ordo-pink/backend-service-offline-notifications"
import { TokenPersistenceStrategy, TokenService } from "@ordo-pink/backend-service-token"
import { UserPersistenceStrategy, UserService } from "@ordo-pink/backend-service-user"
import { type Algorithm } from "@ordo-pink/wjwt"
import { createServer } from "@ordo-pink/backend-utils"

import { handleAccount } from "./handlers/get-account.handler"
import { handleChangeAccountInfo } from "./handlers/change-account-info.handler"
import { handleChangeEmail } from "./handlers/change-email.handler"
import { handleChangePassword } from "./handlers/change-password.handler"
import { handleConfirmEmail } from "./handlers/confirm-email.handler"
import { handleRefreshToken } from "./handlers/refresh-token.handler"
import { handleSignIn } from "./handlers/sign-in.handler"
import { handleSignOut } from "./handlers/sign-out.handler"
import { handleSignUp } from "./handlers/sign-up.handler"
import { handleUserInfoByEmail } from "./handlers/get-user-info-by-email.handler"
import { handleUserInfoByID as handleUserInfoByID } from "./handlers/get-user-info-by-fsid.handler"
import { handleVerifyToken } from "./handlers/verify-token.handler"

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
	notificationSender: Required<EmailContact>
}

export const createIDServer = ({
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
	const userService = UserService.of(userRepository)
	const notificationService = NotificationService.of({
		emailStrategy,
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
				.get("/users/email/:email", handleUserInfoByEmail(ctx))
				.get("/users/id/:id", handleUserInfoByID(ctx))
				.patch("/change-account-info", handleChangeAccountInfo(ctx))
				.patch("/change-email", handleChangeEmail(ctx))
				.patch("/change-password", handleChangePassword(ctx))
				.post("/verify-token", handleVerifyToken(ctx)),
		// .post("/send-forgot-password-email/:email", () => {})
		// .post("/restore-password", () => {})
		// .post("/reset-password", () => {})
	})
}
