// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { UserPersistenceStrategyDynamoDB } from "@ordo-pink/backend-persistence-strategy-user-dynamodb"
import { createIDServer } from "@ordo-pink/backend-server-id"
import { getc } from "@ordo-pink/getc"
import { ConsoleLogger } from "@ordo-pink/logger"
import { getPrivateKey, getPublicKey } from "./utils/get-key"
import { TokenPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-token-fs"
import { FSUserRepository } from "@ordo-pink/backend-persistence-strategy-user-fs"
import { RusenderEmailStrategy } from "@ordo-pink/backend-email-strategy-rusender"

const {
	ID_USER_REPOSITORY,
	ID_DYNAMODB_ENDPOINT,
	ID_DYNAMODB_ACCESS_KEY,
	ID_DYNAMODB_SECRET_KEY,
	ID_DYNAMODB_REGION,
	ID_PORT,
	ID_ACCESS_TOKEN_EXPIRE_IN,
	ID_REFRESH_TOKEN_EXPIRE_IN,
	ID_SALT_ROUNDS,
	ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
	ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
	ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
	ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
	ID_USER_TABLE_NAME,
	WORKSPACE_HOST,
	WEB_HOST,
	ID_EMAIL_API_KEY,
} = getc([
	"ID_USER_REPOSITORY",
	"ID_DYNAMODB_ENDPOINT",
	"ID_DYNAMODB_ACCESS_KEY",
	"ID_DYNAMODB_SECRET_KEY",
	"ID_DYNAMODB_REGION",
	"ID_PORT",
	"ID_ACCESS_TOKEN_EXPIRE_IN",
	"ID_REFRESH_TOKEN_EXPIRE_IN",
	"ID_SALT_ROUNDS",
	"ID_KV_DB_PATH",
	"ID_ACCESS_TOKEN_PRIVATE_KEY_PATH",
	"ID_ACCESS_TOKEN_PUBLIC_KEY_PATH",
	"ID_REFRESH_TOKEN_PRIVATE_KEY_PATH",
	"ID_REFRESH_TOKEN_PUBLIC_KEY_PATH",
	"ID_USER_TABLE_NAME",
	"ID_TOKENS_TABLE_NAME",
	"DATA_DATA_PATH",
	"DATA_METADATA_PATH",
	"WORKSPACE_HOST",
	"WEB_HOST",
	"ID_EMAIL_API_KEY",
])

const main = async () => {
	const accessPrivateKeyPath = ID_ACCESS_TOKEN_PRIVATE_KEY_PATH
	const accessPublicKeyPath = ID_ACCESS_TOKEN_PUBLIC_KEY_PATH
	const refreshPrivateKeyPath = ID_REFRESH_TOKEN_PRIVATE_KEY_PATH
	const refreshPublicKeyPath = ID_REFRESH_TOKEN_PUBLIC_KEY_PATH

	const accessTokenPrivateKey = await getPrivateKey(accessPrivateKeyPath, {
		name: "ECDSA",
		namedCurve: "P-384",
	} as any)
	const accessTokenPublicKey = await getPublicKey(accessPublicKeyPath, {
		name: "ECDSA",
		namedCurve: "P-384",
	} as any)
	const refreshTokenPrivateKey = await getPrivateKey(refreshPrivateKeyPath, {
		name: "ECDSA",
		namedCurve: "P-384",
	} as any)
	const refreshTokenPublicKey = await getPublicKey(refreshPublicKeyPath, {
		name: "ECDSA",
		namedCurve: "P-384",
	} as any)

	const tokenRepository = await TokenPersistenceStrategyFS.of("./var/srv/id/tokens.json")
	const userRepository =
		ID_USER_REPOSITORY === "dynamodb"
			? UserPersistenceStrategyDynamoDB.of({
					region: ID_DYNAMODB_REGION,
					endpoint: ID_DYNAMODB_ENDPOINT,
					accessKeyId: ID_DYNAMODB_ACCESS_KEY,
					secretAccessKey: ID_DYNAMODB_SECRET_KEY,
					tableName: ID_USER_TABLE_NAME,
			  })
			: FSUserRepository.of("./var/srv/id/users.json")
	const emailRepository = RusenderEmailStrategy.of(ID_EMAIL_API_KEY)

	const app = await createIDServer({
		userRepository,
		tokenRepository,
		emailStrategy: emailRepository,
		origin: [WEB_HOST, WORKSPACE_HOST],
		accessKeys: { privateKey: accessTokenPrivateKey, publicKey: accessTokenPublicKey },
		refreshKeys: { privateKey: refreshTokenPrivateKey, publicKey: refreshTokenPublicKey },
		saltRounds: Number(ID_SALT_ROUNDS),
		alg: { name: "ECDSA", namedCurve: "P-384", hash: "SHA-384" }, // TODO: Add support for switching to RSA
		accessTokenExpireIn: Number(ID_ACCESS_TOKEN_EXPIRE_IN),
		refreshTokenExpireIn: Number(ID_REFRESH_TOKEN_EXPIRE_IN),
		notificationSender: { name: "Hello at Ordo.pink", email: "hello@ordo.pink" },
		websiteHost: WEB_HOST,
	})

	ConsoleLogger.info(`ID server running on http://localhost:${ID_PORT}`)

	app.listen({ port: Number(ID_PORT) })
}

main()
