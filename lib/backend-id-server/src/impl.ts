// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import { Application } from "#x/oak@v12.6.0/mod.ts"

import { CryptoKeyPair, TokenRepository, TokenService } from "#lib/backend-token-service/mod.ts"
import { createServer } from "#lib/backend-utils/mod.ts"
import { UserRepository, UserService } from "#lib/backend-user-service/mod.ts"
import { ConsoleLogger, Logger } from "#lib/logger/mod.ts"

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
	userStorageAdapter: UserRepository
	tokenStorageAdapter: TokenRepository
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
	saltRounds: number
	origin: string
	alg: "ES384" // TODO: Add support for switching to RSA
	accessKeys: CryptoKeyPair
	refreshKeys: CryptoKeyPair
	logger?: Logger
}

export type CreateIDServerFn = (params: CreateIDServerFnParams) => Promise<Application>

export const createIDServer: CreateIDServerFn = async ({
	userStorageAdapter,
	tokenStorageAdapter,
	origin,
	accessTokenExpireIn,
	refreshTokenExpireIn,
	accessKeys,
	refreshKeys,
	saltRounds,
	logger = ConsoleLogger,
	alg,
}) => {
	const userService = await UserService.of(userStorageAdapter, { saltRounds })
	const tokenService = TokenService.of({
		adapter: tokenStorageAdapter,
		options: {
			accessTokenExpireIn,
			refreshTokenExpireIn,
			alg,
			keys: { access: accessKeys, refresh: refreshKeys },
			logger,
		},
	})

	return createServer({
		origin,
		logger,
		extendRouter: r =>
			r
				.post("/sign-up", handleSignUp({ userService, tokenService }))
				.post("/sign-in", handleSignIn({ userService, tokenService }))
				.post("/sign-out", handleSignOut({ userService, tokenService }))
				.post("/refresh-token", handleRefreshToken({ userService, tokenService }))
				.get("/account", handleAccount({ userService, tokenService }))
				.get("/users/:email", handleUserInfo({ userService, tokenService }))
				.patch("/change-email", handleChangeEmail({ userService, tokenService }))
				.patch("/change-password", handleChangePassword({ userService, tokenService }))
				.post("/verify-token", handleVerifyToken({ userService, tokenService })),
		// .get("/send-activation-email/:email", () => {})
		// .get("/send-forgot-password-email/:email", () => {})
		// .get("/activate", () => {})
		// .get("/forgot-password", () => {})
	})
}
