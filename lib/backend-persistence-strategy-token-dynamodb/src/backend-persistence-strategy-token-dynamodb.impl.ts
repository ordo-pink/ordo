// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { type AttributeMap, type UpdateItemInput } from "aws-sdk/clients/dynamodb"
import DynamoDB from "aws-sdk/clients/dynamodb"

import { type TokenPersistenceStrategy, type TokenRecord } from "@ordo-pink/backend-service-token"
import { Oath } from "@ordo-pink/oath"

export type DynamoDBConfig = {
	region: string
	endpoint: string
	accessKeyId: string
	secretAccessKey: string
	tableName: string
}

export const TokenPersistenceStrategyDynamoDB = {
	of: ({
		accessKeyId,
		secretAccessKey,
		region,
		endpoint,
		tableName,
	}: DynamoDBConfig): TokenPersistenceStrategy => {
		const db = new DynamoDB({ credentials: { accessKeyId, secretAccessKey }, region, endpoint })

		return {
			getToken: getToken0(tableName, db),
			setToken: setToken0(tableName, db),
			removeToken: removeToken0(tableName, db),
			getTokenRecord: getTokenRecord0(tableName, db),
			setTokenRecord: setTokenRecord0(tableName, db),
			removeTokenRecord: removeTokenRecord0(tableName, db),
		}
	},
}

// --- Internal ---

const getToken0 =
	(TableName: string, db: DynamoDB): TokenPersistenceStrategy["getToken"] =>
	(sub, jti) =>
		Oath.of(sub)
			.chain(getTokenRecord0(TableName, db))
			.chain(record => Oath.fromNullable(record).rejectedMap(() => new Error("Token not found")))
			.map(record => record[jti])

const setToken0 =
	(TableName: string, db: DynamoDB): TokenPersistenceStrategy["setToken"] =>
	(sub, jti, token) =>
		Oath.of(sub)
			.chain(getTokenRecord0(TableName, db))
			.fix(() => ({}))
			.map(record => ({ ...record, [jti]: token }))
			.chain(record => Oath.of(setTokenRecord0(TableName, db)).chain(f => f(sub, record)))

const removeToken0 =
	(TableName: string, db: DynamoDB): TokenPersistenceStrategy["removeToken"] =>
	(sub, jti) =>
		Oath.of(sub)
			.chain(getTokenRecord0(TableName, db))
			.map(record => ({ ...record, [jti]: undefined }))
			.chain(record => Oath.of(setTokenRecord0(TableName, db)).chain(f => f(sub, record)))

const getTokenRecord0 =
	(TableName: string, db: DynamoDB): TokenPersistenceStrategy["getTokenRecord"] =>
	sub =>
		Oath.try(() => db.getItem({ TableName, Key: { sub: { S: sub } } }).promise())
			.chain(({ Item }) => Oath.fromNullable(Item).rejectedMap(() => new Error("Token not found")))
			.map(deserialise)

const setTokenRecord0 =
	(TableName: string, db: DynamoDB): TokenPersistenceStrategy["setTokenRecord"] =>
	(sub, record) =>
		Oath.of(serialise(record))
			.chain(AttributeUpdates =>
				Oath.try(() =>
					db.updateItem({ TableName, Key: { sub: { S: sub } }, AttributeUpdates }).promise(),
				),
			)
			.map(() => "OK")

const removeTokenRecord0 =
	(TableName: string, db: DynamoDB): TokenPersistenceStrategy["removeTokenRecord"] =>
	sub =>
		Oath.try(() => db.deleteItem({ TableName, Key: { sub: { S: sub } } })).map(() => "OK")

const deserialise = (item: AttributeMap): TokenRecord => JSON.parse(item.record?.S ?? "")
const serialise = (record: TokenRecord): UpdateItemInput["AttributeUpdates"] => ({
	record: { Action: "PUT", Value: { S: JSON.stringify(record) } },
})
