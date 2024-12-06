/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import chalk from "chalk"

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { ConsoleLogger } from "@ordo-pink/logger"
import { EmailStrategyRusender } from "@ordo-pink/backend-email-strategy-rusender"
import { PersistenceStrategyTokenFS } from "@ordo-pink/backend-persistence-strategy-token-fs"
// import { PersistenceStrategyUserDynamoDB } from "@ordo-pink/backend-persistence-strategy-user-dynamodb"
import { PersistenceStrategyUserFS } from "@ordo-pink/backend-persistence-strategy-user-fs"
import { Switch } from "@ordo-pink/switch"
// import { TokenPersistenceStrategyDynamoDB } from "@ordo-pink/backend-persistence-strategy-token-dynamodb"
import { create_id_server } from "@ordo-pink/backend-server-id"

const port = Number(Bun.env.ORDO_ID_PORT!)
const at_expire_in = Number(Bun.env.ORDO_ID_ACCESS_TOKEN_EXPIRE_IN)
const rt_expire_in = Number(Bun.env.ORDO_ID_REFRESH_TOKEN_EXPIRE_IN)
const website_host = Bun.env.ORDO_WEB_HOST!
const logger = ConsoleLogger
const origin = [Bun.env.ORDO_DT_PRIVATE_HOST!, Bun.env.ORDO_WORKSPACE_HOST!, Bun.env.ORDO_WEB_HOST!, Bun.env.ORDO_DT_HOST!]

const user_strategy_type = Bun.env.ORDO_ID_USER_PERSISTENCE_STRATEGY!
const token_strategy_type = Bun.env.ORDO_ID_TOKEN_PERSISTENCE_STRATEGY!

// const user_dynamo_db_config = {
// 	region: Bun.env.ORDO_ID_USER_DYNAMODB_REGION!,
// 	endpoint: Bun.env.ORDO_ID_USER_DYNAMODB_ENDPOINT!,
// 	access_key: Bun.env.ORDO_ID_USER_DYNAMODB_ACCESS_KEY!,
// 	secret_key: Bun.env.ORDO_ID_USER_DYNAMODB_SECRET_KEY!,
// 	table_name: Bun.env.ORDO_ID_USER_DYNAMODB_USER_TABLE!,
// }

// const token_dynamo_db_config = {
// 	region: Bun.env.ORDO_ID_TOKEN_DYNAMODB_REGION!,
// 	endpoint: Bun.env.ORDO_ID_TOKEN_DYNAMODB_ENDPOINT!,
// 	access_key: Bun.env.ORDO_ID_TOKEN_DYNAMODB_ACCESS_KEY!,
// 	secret_key: Bun.env.ORDO_ID_TOKEN_DYNAMODB_SECRET_KEY!,
// 	table_name: Bun.env.ORDO_ID_TOKEN_DYNAMODB_USER_TABLE!,
// }

const alg = { name: "ECDSA", namedCurve: "P-384", hash: "SHA-384" } as const

const main = async () => {
	const at_private_key = await get_key(Bun.env.ORDO_ID_ACCESS_TOKEN_PRIVATE_KEY!, "private")
	const at_public_key = await get_key(Bun.env.ORDO_ID_ACCESS_TOKEN_PUBLIC_KEY!, "public")

	const rt_private_key = await get_key(Bun.env.ORDO_ID_REFRESH_TOKEN_PRIVATE_KEY!, "private")
	const rt_public_key = await get_key(Bun.env.ORDO_ID_REFRESH_TOKEN_PUBLIC_KEY!, "public")

	const keys = {
		access: { privateKey: at_private_key, publicKey: at_public_key },
		refresh: { privateKey: rt_private_key, publicKey: rt_public_key },
	}

	// TODO: Move to env
	const audience = ["https://ordo.pink", "https://id.ordo.pink", "https://dt.ordo.pink"]
	const issuer = "https://id.ordo.pink"

	const token_persistence_strategy = Switch.Match(token_strategy_type)
		// 	.case("dynamodb", () => TokenPersistenceStrategyDynamoDB.of(token_dynamo_db_config))
		.default(() => PersistenceStrategyTokenFS.of(Bun.env.ORDO_ID_TOKEN_FS_STRATEGY_PATH!))

	const user_persistence_strategy = Switch.Match(user_strategy_type)
		// .case("dynamodb", () => PersistenceStrategyUserDynamoDB.of(user_dynamo_db_config))
		.default(() => PersistenceStrategyUserFS.of(Bun.env.ORDO_ID_USER_FS_STRATEGY_PATH!))

	const email_strategy = EmailStrategyRusender.create({ key: Bun.env.ORDO_ID_EMAIL_API_KEY! })

	const app = await create_id_server({
		user_persistence_strategy,
		token_persistence_strategy,
		email_strategy,
		origin,
		logger,
		token_service_options: {
			alg,
			at_expire_in,
			audience,
			issuer,
			logger,
			rt_expire_in,
			keys,
		},
		website_host,
		notification_sender: { name: "Привет от Ordo.pink", email: "hello@ordo.pink" },
	})

	app.listen({ port: Number(port) }, () => logger.info(`ID running on http://localhost:${chalk.blue(port)}`))
}

const get_key = (key: string, type: "public" | "private") =>
	Oath.FromNullable(key)
		.pipe(ops0.map(key => Buffer.from(key, "base64")))
		.pipe(ops0.map(buffer => new Uint8Array(buffer)))
		.pipe(
			ops0.chain(key =>
				Oath.FromPromise<CryptoKey>(() =>
					type === "private"
						? crypto.subtle.importKey("pkcs8", key, alg, true, ["sign"])
						: crypto.subtle.importKey("spki", key, alg, true, ["verify"]),
				),
			),
		)
		.invoke(
			invokers0.or_else(error => {
				logger.panic(error)
				process.exit(1)
			}),
		)

void main()
