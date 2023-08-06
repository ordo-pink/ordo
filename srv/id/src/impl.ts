// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { resolve } from "#std/path/mod.ts"
import { DynamoDBUserStorageAdapter } from "#lib/backend-dynamodb-user-repository/mod.ts"
import { DenoKVTokenStorageAdapter } from "#lib/backend-deno-kv-token-repository/mod.ts"
import { DenoKVUserStorageAdapter } from "#lib/backend-deno-kv-user-repository/mod.ts"
import { createIDServer } from "#lib/backend-id-server/mod.ts"
import { Switch } from "#lib/switch/mod.ts"
import { getc } from "#lib/getc/mod.ts"
import { getPrivateKey, getPublicKey } from "./utils/get-key.ts"

const {
	ID_USER_ADAPTER,
	ID_DYNAMODB_ENDPOINT,
	ID_DYNAMODB_ACCESS_KEY,
	ID_DYNAMODB_SECRET_KEY,
	ID_DYNAMODB_REGION,
	ID_PORT,
	ID_ACCESS_TOKEN_EXPIRE_IN,
	ID_REFRESH_TOKEN_EXPIRE_IN,
	ID_ACCESS_CONTROL_ALLOW_ORIGIN,
	ID_SALT_ROUNDS,
	ID_KV_DB_PATH,
	ID_ACCESS_TOKEN_PRIVATE_KEY_PATH,
	ID_ACCESS_TOKEN_PUBLIC_KEY_PATH,
	ID_REFRESH_TOKEN_PRIVATE_KEY_PATH,
	ID_REFRESH_TOKEN_PUBLIC_KEY_PATH,
	ID_USER_TABLE_NAME,
	ID_TOKENS_TABLE_NAME,
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
])

const accessPrivateKeyString = resolve(ID_ACCESS_TOKEN_PRIVATE_KEY_PATH)
const accessPublicKeyString = resolve(ID_ACCESS_TOKEN_PUBLIC_KEY_PATH)
const refreshPrivateKeyString = resolve(ID_REFRESH_TOKEN_PRIVATE_KEY_PATH)
const refreshPublicKeyString = resolve(ID_REFRESH_TOKEN_PUBLIC_KEY_PATH)

const accessTokenPrivateKey = await getPrivateKey(accessPrivateKeyString)
const accessTokenPublicKey = await getPublicKey(accessPublicKeyString)
const refreshTokenPrivateKey = await getPrivateKey(refreshPrivateKeyString)
const refreshTokenPublicKey = await getPublicKey(refreshPublicKeyString)

const kvPath = `${ID_KV_DB_PATH.endsWith("/") ? ID_KV_DB_PATH : `${ID_KV_DB_PATH}/`}kvdb`

const tokenStorageAdapter = await DenoKVTokenStorageAdapter.of(kvPath, ID_TOKENS_TABLE_NAME)
const userStorageAdapter = await Switch.of(ID_USER_ADAPTER)
	.case("dynamodb", () =>
		DynamoDBUserStorageAdapter.of({
			region: ID_DYNAMODB_REGION,
			endpoint: ID_DYNAMODB_ENDPOINT,
			awsAccessKeyId: ID_DYNAMODB_ACCESS_KEY,
			awsSecretKey: ID_DYNAMODB_SECRET_KEY,
			tableName: ID_USER_TABLE_NAME,
		})
	)
	.case("kv", () => DenoKVUserStorageAdapter.of({ path: kvPath, key: ID_USER_TABLE_NAME }))
	.default(() => DenoKVUserStorageAdapter.of({ path: kvPath, key: ID_USER_TABLE_NAME }))

const app = await createIDServer({
	userStorageAdapter,
	tokenStorageAdapter,
	origin: ID_ACCESS_CONTROL_ALLOW_ORIGIN,
	accessKeys: { private: accessTokenPrivateKey, public: accessTokenPublicKey },
	refreshKeys: { private: refreshTokenPrivateKey, public: refreshTokenPublicKey },
	saltRounds: Number(ID_SALT_ROUNDS),
	alg: "ES384", // TODO: Add support for switching to RSA
	accessTokenExpireIn: Number(ID_ACCESS_TOKEN_EXPIRE_IN),
	refreshTokenExpireIn: Number(ID_REFRESH_TOKEN_EXPIRE_IN),
})

console.log(`ID server running on http://localhost:${ID_PORT}`)

await app.listen({ port: Number(ID_PORT) })
