// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { TokenRepository, TokenService } from "@ordo-pink/backend-token-service"
import { UserRepository, UserService } from "@ordo-pink/backend-user-service"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { createServer } from "@ordo-pink/backend-utils"

import { handleChangeAccountInfo } from "./handlers/change-account-info.handler"
import { handleChangePassword } from "./handlers/change-password.handler"
import { handleRefreshToken } from "./handlers/refresh-token.handler"
import { handleVerifyToken } from "./handlers/verify-token.handler"
import { handleChangeEmail } from "./handlers/change-email.handler"
import { handleUserInfo } from "./handlers/user-info.handler"
import { handleSignOut } from "./handlers/sign-out.handler"
import { handleAccount } from "./handlers/account.handler"
import { handleSignIn } from "./handlers/sign-in.handler"
import { handleSignUp } from "./handlers/sign-up.handler"
import { Algorithm } from "@ordo-pink/wjwt"

export type CreateIDServerFnParams = {
	userRepository: UserRepository
	tokenRepository: TokenRepository
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	saltRounds: number
	origin: string | string[]
	alg: Algorithm
	accessKeys: CryptoKeyPair
	refreshKeys: CryptoKeyPair
	logger?: Logger
}

export const createIDServer = async ({
	userRepository,
	tokenRepository,
	origin,
	accessTokenExpireIn,
	refreshTokenExpireIn,
	accessKeys,
	refreshKeys,
	saltRounds,
	logger = ConsoleLogger,
	alg,
}: CreateIDServerFnParams) => {
	const userService = await UserService.of(userRepository, { saltRounds })
	const tokenService = TokenService.of({
		repository: tokenRepository,
		options: {
			accessTokenExpireIn,
			refreshTokenExpireIn,
			alg,
			keys: { access: accessKeys, refresh: refreshKeys },
			logger,
		},
	})

	const ctx = { userService, tokenService }

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
				.get("/account", handleAccount(ctx))
				.get("/users/:email", handleUserInfo(ctx))
				.patch("/change-account-info", handleChangeAccountInfo(ctx))
				.patch("/change-email", handleChangeEmail(ctx))
				.patch("/change-password", handleChangePassword(ctx))
				.post("/verify-token", handleVerifyToken(ctx)),
		// .get("/send-activation-email/:email", () => {})
		// .get("/send-forgot-password-email/:email", () => {})
		// .get("/activate", () => {})
		// .get("/forgot-password", () => {})
	})
}
