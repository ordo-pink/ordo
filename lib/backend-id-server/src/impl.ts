// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Application } from "#x/oak@v12.6.0/mod.ts"

import { CryptoKeyPair, TokenRepository, TokenService } from "#lib/backend-token-service/mod.ts"
import {
	BackendDataService,
	DataRepository,
	MetadataRepository,
} from "#lib/universal-data-service/mod.ts"
import { UserRepository, UserService } from "#lib/backend-user-service/mod.ts"
import { ConsoleLogger, Logger } from "#lib/logger/mod.ts"
import { createServer } from "#lib/backend-utils/mod.ts"

import { handleChangePassword } from "./handlers/change-password.ts"
import { handleRefreshToken } from "./handlers/refresh-token.ts"
import { handleVerifyToken } from "./handlers/verify-token.ts"
import { handleChangeEmail } from "./handlers/change-email.ts"
import { handleUserInfo } from "./handlers/user-info.ts"
import { handleSignOut } from "./handlers/sign-out.ts"
import { handleAccount } from "./handlers/account.ts"
import { handleSignIn } from "./handlers/sign-in.ts"
import { handleSignUp } from "./handlers/sign-up.ts"

// TODO: Extract errors to enum
// TODO: Audit
export type CreateIDServerFnParams = {
	userStorageRepository: UserRepository
	tokenStorageRepository: TokenRepository
	metadataRepository: MetadataRepository
	dataRepository: DataRepository<ReadableStream>
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	saltRounds: number
	origin: string | string[]
	alg: "ES384" // TODO: Add support for switching to RSA
	accessKeys: CryptoKeyPair
	refreshKeys: CryptoKeyPair
	logger?: Logger
}

export type CreateIDServerFn = (params: CreateIDServerFnParams) => Promise<Application>

export const createIDServer: CreateIDServerFn = async ({
	userStorageRepository,
	tokenStorageRepository,
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
}) => {
	const dataService = BackendDataService.of({ dataRepository, metadataRepository })
	const userService = await UserService.of(userStorageRepository, { saltRounds })
	const tokenService = TokenService.of({
		repository: tokenStorageRepository,
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
