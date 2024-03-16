// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import chalk from "chalk"
import { UserPersistenceStrategyDynamoDB } from "@ordo-pink/backend-persistence-strategy-user-dynamodb"
import { TokenPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-token-fs"
import { PersistenceStrategyUserFS } from "@ordo-pink/backend-persistence-strategy-user-fs"
import { EmailStrategyRusender } from "@ordo-pink/backend-email-strategy-rusender"
import { createIDServer } from "@ordo-pink/backend-server-id"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Switch } from "@ordo-pink/switch"
import { Oath } from "@ordo-pink/oath"
import { TokenPersistenceStrategyDynamoDB } from "@ordo-pink/backend-persistence-strategy-token-dynamodb"

const port = Bun.env.ORDO_ID_PORT!
const accessTokenExpireIn = Number(Bun.env.ORDO_ID_ACCESS_TOKEN_EXPIRE_IN)
const refreshTokenExpireIn = Number(Bun.env.ORDO_ID_REFRESH_TOKEN_EXPIRE_IN)
const websiteHost = Bun.env.ORDO_WEB_HOST!
const logger = ConsoleLogger
const origin = [
	Bun.env.ORDO_DT_PRIVATE_HOST!,
	Bun.env.ORDO_WORKSPACE_HOST!,
	Bun.env.ORDO_WEB_HOST!,
	Bun.env.ORDO_DT_HOST!,
]

const userPersistenceStrategyType = Bun.env.ORDO_ID_USER_PERSISTENCE_STRATEGY!
const tokenPersistenceStrategyType = Bun.env.ORDO_ID_TOKEN_PERSISTENCE_STRATEGY!

const userDynamoDBParams = {
	region: Bun.env.ORDO_ID_USER_DYNAMODB_REGION!,
	endpoint: Bun.env.ORDO_ID_USER_DYNAMODB_ENDPOINT!,
	accessKeyId: Bun.env.ORDO_ID_USER_DYNAMODB_ACCESS_KEY!,
	secretAccessKey: Bun.env.ORDO_ID_USER_DYNAMODB_SECRET_KEY!,
	tableName: Bun.env.ORDO_ID_USER_DYNAMODB_USER_TABLE!,
}

const tokenDynamoDBParams = {
	region: Bun.env.ORDO_ID_TOKEN_DYNAMODB_REGION!,
	endpoint: Bun.env.ORDO_ID_TOKEN_DYNAMODB_ENDPOINT!,
	accessKeyId: Bun.env.ORDO_ID_TOKEN_DYNAMODB_ACCESS_KEY!,
	secretAccessKey: Bun.env.ORDO_ID_TOKEN_DYNAMODB_SECRET_KEY!,
	tableName: Bun.env.ORDO_ID_TOKEN_DYNAMODB_USER_TABLE!,
}

const main = async () => {
	const accessTokenPrivateKey = await getKey(Bun.env.ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY!, "private")
	const accessTokenPublicKey = await getKey(Bun.env.ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY!, "public")
	const refreshTokenPrivateKey = await getKey(Bun.env.ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY!, "private")
	const refreshTokenPublicKey = await getKey(Bun.env.ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY!, "public")

	const accessKeys = { privateKey: accessTokenPrivateKey, publicKey: accessTokenPublicKey }
	const refreshKeys = { privateKey: refreshTokenPrivateKey, publicKey: refreshTokenPublicKey }

	const tokenRepository = await Switch.of(tokenPersistenceStrategyType)
		.case("dynamodb", () => TokenPersistenceStrategyDynamoDB.of(tokenDynamoDBParams))
		.default(() => TokenPersistenceStrategyFS.of(Bun.env.ORDO_ID_TOKEN_FS_STRATEGY_PATH!))

	const userRepository = Switch.of(userPersistenceStrategyType)
		.case("dynamodb", () => UserPersistenceStrategyDynamoDB.of(userDynamoDBParams))
		.default(() => PersistenceStrategyUserFS.of(Bun.env.ORDO_ID_USER_FS_STRATEGY_PATH!))

	const emailStrategy = EmailStrategyRusender.create(Bun.env.ORDO_ID_EMAIL_API_KEY!)

	const app = await createIDServer({
		userRepository,
		tokenRepository,
		emailStrategy,
		origin,
		logger,
		accessKeys,
		refreshKeys,
		websiteHost,
		accessTokenExpireIn,
		refreshTokenExpireIn,
		alg: { name: "ECDSA", namedCurve: "P-384", hash: "SHA-384" }, // TODO: Add support for switching to RSA
		notificationSender: { name: "Привет от Ordo.pink", email: "hello@ordo.pink" },
	})

	app.listen({ port: Number(port) }, () =>
		ConsoleLogger.info(`ID running on http://localhost:${chalk.blue(port)}`),
	)
}

const getKey = (key: string, type: "public" | "private") =>
	Oath.fromNullable(key)
		.map(key => Buffer.from(key, "base64"))
		.map(buffer => new Uint8Array(buffer))
		.chain(key =>
			Oath.from(() =>
				type === "private"
					? crypto.subtle.importKey(
							"pkcs8",
							key,
							{
								name: "ECDSA",
								namedCurve: "P-384",
							},
							true,
							["sign"],
						)
					: crypto.subtle.importKey(
							"spki",
							key,
							{
								name: "ECDSA",
								namedCurve: "P-384",
							},
							true,
							["verify"],
						),
			),
		)
		.orElse(e => {
			console.error(e)
			process.exit(1)
		})

main()
