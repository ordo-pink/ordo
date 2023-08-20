// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { CryptoKeyPair, TokenRepository, TokenService } from "@ordo-pink/backend-token-service"
import {
	BackendDataService,
	DataRepository,
	MetadataRepository,
} from "@ordo-pink/backend-data-service"
import { UserRepository, UserService } from "@ordo-pink/backend-user-service"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { createServer } from "@ordo-pink/backend-utils"
import { Readable } from "stream"

import { handleChangePassword } from "./handlers/change-password"
import { handleRefreshToken } from "./handlers/refresh-token"
import { handleVerifyToken } from "./handlers/verify-token"
import { handleChangeEmail } from "./handlers/change-email"
import { handleUserInfo } from "./handlers/user-info"
import { handleSignOut } from "./handlers/sign-out"
import { handleAccount } from "./handlers/account"
import { handleSignIn } from "./handlers/sign-in"
import { handleSignUp } from "./handlers/sign-up"

// TODO: Extract errors to enum
// TODO: Audit
export type CreateIDServerFnParams = {
	userRepository: UserRepository
	tokenRepository: TokenRepository
	metadataRepository: MetadataRepository
	dataRepository: DataRepository<Readable>
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	saltRounds: number
	origin: string | string[]
	alg: "ES384" // TODO: Add support for switching to RSA
	accessKeys: CryptoKeyPair
	refreshKeys: CryptoKeyPair
	logger?: Logger
}

export const createIDServer = async ({
	userRepository,
	tokenRepository,
	dataRepository,
	metadataRepository,
	origin,
	accessTokenExpireIn,
	refreshTokenExpireIn,
	accessKeys,
	refreshKeys,
	saltRounds,
	logger = ConsoleLogger,
	alg,
}: CreateIDServerFnParams) => {
	const dataService = BackendDataService.of({ dataRepository, metadataRepository })
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

	const ctx = { userService, tokenService, dataService }

	return createServer({
		origin,
		logger,
		serverName: "id-server",
		extendRouter: r =>
			r
				.post("/sign-up", handleSignUp(ctx))
				.post("/sign-in", handleSignIn(ctx))
				.post("/sign-out", handleSignOut(ctx))
				.post("/refresh-token", handleRefreshToken(ctx))
				.get("/account", handleAccount(ctx))
				.get("/users/:email", handleUserInfo(ctx))
				.patch("/change-email", handleChangeEmail(ctx))
				.patch("/change-password", handleChangePassword(ctx))
				.post("/verify-token", handleVerifyToken(ctx)),
		// .get("/send-activation-email/:email", () => {})
		// .get("/send-forgot-password-email/:email", () => {})
		// .get("/activate", () => {})
		// .get("/forgot-password", () => {})
	})
}
