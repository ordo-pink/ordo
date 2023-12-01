// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
	saltRounds: number
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
	saltRounds,
	logger = ConsoleLogger,
	websiteHost,
	notificationSender,
	alg,
}: CreateIDServerFnParams) => {
	const userService = await UserService.of(userRepository, { saltRounds })
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
