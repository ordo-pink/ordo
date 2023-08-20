// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DynamoDBUserStorageAdapter } from "@ordo-pink/backend-dynamodb-user-repository"
import { createIDServer } from "@ordo-pink/backend-id-server"
import { getc } from "@ordo-pink/getc"
import { ConsoleLogger } from "@ordo-pink/logger"
import { FSDataRepository } from "@ordo-pink/backend-fs-data-repository"
import { FSMetadataRepository } from "@ordo-pink/backend-fs-metadata-repository"
import { getPrivateKey, getPublicKey } from "./utils/get-key"
import { MemoryTokenRepository } from "@ordo-pink/backend-memory-token-repository"

const {
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
	DATA_DATA_PATH,
	DATA_METADATA_PATH,
	WORKSPACE_HOST,
	WEB_HOST,
} = getc([
	"ID_USER_ADAPTER",
	"ID_DYNAMODB_ENDPOINT",
	"ID_DYNAMODB_ACCESS_KEY",
	"ID_DYNAMODB_SECRET_KEY",
	"ID_DYNAMODB_REGION",
	"ID_PORT",
	"ID_ACCESS_TOKEN_EXPIRE_IN",
	"ID_REFRESH_TOKEN_EXPIRE_IN",
	"ID_ACCESS_CONTROL_ALLOW_ORIGIN",
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
])

const main = async () => {
	const accessPrivateKeyPath = ID_ACCESS_TOKEN_PRIVATE_KEY_PATH
	const accessPublicKeyPath = ID_ACCESS_TOKEN_PUBLIC_KEY_PATH
	const refreshPrivateKeyPath = ID_REFRESH_TOKEN_PRIVATE_KEY_PATH
	const refreshPublicKeyPath = ID_REFRESH_TOKEN_PUBLIC_KEY_PATH

	const accessTokenPrivateKey = await getPrivateKey(accessPrivateKeyPath)
	const accessTokenPublicKey = await getPublicKey(accessPublicKeyPath)
	const refreshTokenPrivateKey = await getPrivateKey(refreshPrivateKeyPath)
	const refreshTokenPublicKey = await getPublicKey(refreshPublicKeyPath)

	const dataRepository = FSDataRepository.of({ root: DATA_DATA_PATH })
	const metadataRepository = FSMetadataRepository.of({ root: DATA_METADATA_PATH })

	const tokenStorageRepository = MemoryTokenRepository.create()

	const userStorageRepository = DynamoDBUserStorageAdapter.of({
		region: ID_DYNAMODB_REGION,
		endpoint: ID_DYNAMODB_ENDPOINT,
		awsAccessKeyId: ID_DYNAMODB_ACCESS_KEY,
		awsSecretKey: ID_DYNAMODB_SECRET_KEY,
		tableName: ID_USER_TABLE_NAME,
	})

	const app = await createIDServer({
		userRepository: userStorageRepository,
		tokenRepository: tokenStorageRepository,
		dataRepository,
		metadataRepository,
		origin: [WEB_HOST, WORKSPACE_HOST],
		accessKeys: { private: accessTokenPrivateKey, public: accessTokenPublicKey },
		refreshKeys: { private: refreshTokenPrivateKey, public: refreshTokenPublicKey },
		saltRounds: Number(ID_SALT_ROUNDS),
		alg: "ES384", // TODO: Add support for switching to RSA
		accessTokenExpireIn: Number(ID_ACCESS_TOKEN_EXPIRE_IN),
		refreshTokenExpireIn: Number(ID_REFRESH_TOKEN_EXPIRE_IN),
	})

	ConsoleLogger.info(`ID server running on http://localhost:${ID_PORT}`)

	app.listen({ port: Number(ID_PORT) })
}

main()
