// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { UserPersistenceStrategyDynamoDB } from "@ordo-pink/backend-persistence-strategy-user-dynamodb"
import { createIDServer } from "@ordo-pink/backend-server-id"
import { ConsoleLogger } from "@ordo-pink/logger"
import { importPrivateKey0, importPublicKey0 } from "./utils/get-key"
import { TokenPersistenceStrategyMemory } from "@ordo-pink/backend-persistence-strategy-token-memory"
import { FSUserRepository } from "@ordo-pink/backend-persistence-strategy-user-fs"
import { RusenderEmailStrategy } from "@ordo-pink/backend-email-strategy-rusender"

declare const ID_USER_REPOSITORY: string
declare const ID_DYNAMODB_ENDPOINT: string
declare const ID_DYNAMODB_ACCESS_KEY: string
declare const ID_DYNAMODB_SECRET_KEY: string
declare const ID_DYNAMODB_REGION: string
declare const ID_PORT: string
declare const ID_ACCESS_TOKEN_EXPIRE_IN: string
declare const ID_REFRESH_TOKEN_EXPIRE_IN: string
declare const ID_ACCESS_TOKEN_PRIVATE_KEY: string
declare const ID_ACCESS_TOKEN_PUBLIC_KEY: string
declare const ID_REFRESH_TOKEN_PRIVATE_KEY: string
declare const ID_REFRESH_TOKEN_PUBLIC_KEY: string
declare const ID_USER_TABLE_NAME: string
declare const ID_TOKENS_TABLE_NAME: string
declare const ID_TOKEN_PERSISTENCE_STRATEGY_MEMORY_PATH: string
declare const ID_USER_PERSISTENCE_STRATEGY_MEMORY_PATH: string
declare const ID_EMAIL_API_KEY: string
declare const WORKSPACE_HOST: string
declare const DATA_INTERNAL_HOST: string
declare const WEB_HOST: string

const main = async () => {
	const emailRepository = RusenderEmailStrategy.of(ID_EMAIL_API_KEY)

	const accessPrivateKey = await importPrivateKey0(ID_ACCESS_TOKEN_PRIVATE_KEY).orElse(dieOnError)
	const accessPublicKey = await importPublicKey0(ID_ACCESS_TOKEN_PUBLIC_KEY).orElse(dieOnError)
	const refreshPrivateKey = await importPrivateKey0(ID_REFRESH_TOKEN_PRIVATE_KEY).orElse(dieOnError)
	const refreshPublicKey = await importPublicKey0(ID_REFRESH_TOKEN_PUBLIC_KEY).orElse(dieOnError)

	const tokenRepository = await TokenPersistenceStrategyMemory.of(
		ID_TOKEN_PERSISTENCE_STRATEGY_MEMORY_PATH,
	)
	const userRepository =
		ID_USER_REPOSITORY === "ydb"
			? UserPersistenceStrategyDynamoDB.of({
					region: ID_DYNAMODB_REGION,
					endpoint: ID_DYNAMODB_ENDPOINT,
					accessKeyId: ID_DYNAMODB_ACCESS_KEY,
					secretAccessKey: ID_DYNAMODB_SECRET_KEY,
					tableName: ID_USER_TABLE_NAME,
			  })
			: FSUserRepository.of(ID_USER_PERSISTENCE_STRATEGY_MEMORY_PATH)

	const app = await createIDServer({
		userRepository,
		tokenRepository,
		emailStrategy: emailRepository,
		origin: [WEB_HOST, WORKSPACE_HOST, DATA_INTERNAL_HOST],
		accessKeys: { privateKey: accessPrivateKey, publicKey: accessPublicKey },
		refreshKeys: { privateKey: refreshPrivateKey, publicKey: refreshPublicKey },
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

const dieOnError = (error: any) => {
	console.log(error)
	process.exit(1)
}
