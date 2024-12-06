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

import DynamoDB from "aws-sdk/clients/dynamodb"

import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/managers"
import { type SUB } from "@ordo-pink/wjwt"
import { noop } from "@ordo-pink/tau"

import type * as Types from "./backend-persistence-strategy-user-dynamodb.types"
import { O } from "@ordo-pink/option"

let dynamo_db: DynamoDB

export const PersistenceStrategyUserDynamoDB: Types.TPersistenceStrategyDynamoDBStatic = {
	of: (dynamo_db_config: Types.TDynamoDBConfig) => {
		const { access_key: accessKeyId, secret_key: secretAccessKey, region, endpoint, table_name: tableName } = dynamo_db_config
		const TableName = tableName
		const credentials = { accessKeyId, secretAccessKey }

		if (!dynamo_db) dynamo_db = new DynamoDB({ region, endpoint, credentials })

		return {
			create: user =>
				Oath.Merge([
					_check_not_exists_by_email0(dynamo_db_config, user.email),
					_check_not_exists_by_id0(dynamo_db_config, user.id),
					_check_not_exists_by_handle0(dynamo_db_config, user.handle),
				])
					.pipe(Oath.ops.map(() => _serialise(user)))
					.pipe(
						Oath.ops.chain(Item =>
							Oath.Try(() => dynamo_db.putItem({ TableName, Item }))
								.pipe(Oath.ops.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(Oath.ops.rejected_map(e => eio(`create -> error: ${e.message}`))),
						),
					)
					.pipe(Oath.ops.map(noop)),

			update: (id, user) =>
				PersistenceStrategyUserDynamoDB.of(dynamo_db_config)
					.get_by_id(id)
					.pipe(
						Oath.ops.chain(option =>
							option.cata({
								Some: Oath.Resolve,
								None: () => Oath.Reject(enoent(`update -> id: ${id}`)),
							}),
						),
					)
					.pipe(Oath.ops.map(() => ({ Key: { id: { S: id } }, Item: _serialise(user) })))
					.pipe(
						Oath.ops.chain(params =>
							Oath.Try(() => dynamo_db.putItem({ TableName, ...params }))
								.pipe(Oath.ops.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(Oath.ops.rejected_map(e => eio(`update -> error: ${e.message}`))),
						),
					)
					.pipe(Oath.ops.map(() => user)),

			get_by_id: id =>
				Oath.Resolve({ id: { S: id } })
					.pipe(
						Oath.ops.chain(Key =>
							Oath.Try(() => dynamo_db.getItem({ TableName, Key }))
								.pipe(Oath.ops.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(Oath.ops.rejected_map(e => eio(`get_by_id -> error: ${e.message}`))),
						),
					)
					.pipe(Oath.ops.map(({ Item }) => O.FromNullable(Item).pipe(O.ops.map(_deserialize)))),

			get_by_email: email =>
				Oath.Resolve({
					FilterExpression: "email = :e",
					ExpressionAttributeValues: { ":e": { S: email } },
				})
					.pipe(
						Oath.ops.chain(params =>
							Oath.Try(() => dynamo_db.scan({ TableName, ...params }))
								.pipe(Oath.ops.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(Oath.ops.rejected_map(e => eio(`get_by_email -> error: ${e.message}`))),
						),
					)
					.pipe(Oath.ops.map(out => O.FromNullable(out.Items?.[0]).pipe(O.ops.map(_deserialize)))),

			get_by_handle: handle =>
				Oath.Resolve({
					FilterExpression: "handle = :e",
					ExpressionAttributeValues: { ":e": { S: handle } },
				})
					.pipe(
						Oath.ops.chain(params =>
							Oath.Try(() => dynamo_db.scan({ TableName, ...params }))
								.pipe(Oath.ops.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(Oath.ops.rejected_map(e => eio(`get_by_handle -> error: ${e.message}`))),
						),
					)
					.pipe(Oath.ops.map(out => O.FromNullable(out.Items?.[0]).pipe(O.ops.map(_deserialize)))),

			exists_by_id: id =>
				PersistenceStrategyUserDynamoDB.of(dynamo_db_config)
					.get_by_id(id)
					.pipe(Oath.ops.map(() => true))
					.fix(() => false),

			exists_by_email: email =>
				PersistenceStrategyUserDynamoDB.of(dynamo_db_config)
					.get_by_email(email)
					.pipe(Oath.ops.map(() => true))
					.fix(() => false),

			exists_by_handle: handle =>
				PersistenceStrategyUserDynamoDB.of(dynamo_db_config)
					.get_by_handle(handle)
					.pipe(Oath.ops.map(() => true))
					.fix(() => false),
		}
	},
}

// --- Internal ---

const LOCATION = "PersistenceStrategyUserDynamoDB"
const eio = RRR.codes.eio(LOCATION)
const eexist = RRR.codes.eexist(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)

const _check_not_exists_by_handle0 = (params: Types.TDynamoDBConfig, handle: Ordo.User.Current.Instance["handle"]) =>
	PersistenceStrategyUserDynamoDB.of(params)
		.exists_by_handle(handle)
		.pipe(Oath.ops.chain(exists => Oath.If(!exists, { F: () => eexist(`create -> handle: ${handle}`) })))

const _check_not_exists_by_id0 = (params: Types.TDynamoDBConfig, id: Ordo.User.Current.Instance["id"]) =>
	PersistenceStrategyUserDynamoDB.of(params)
		.exists_by_id(id)
		.pipe(Oath.ops.chain(exists => Oath.If(!exists, { F: () => eexist(`create -> id: ${id}`) })))

const _check_not_exists_by_email0 = (params: Types.TDynamoDBConfig, email: Ordo.User.Current.Instance["email"]) =>
	PersistenceStrategyUserDynamoDB.of(params)
		.exists_by_email(email)
		.pipe(Oath.ops.chain(exists => Oath.If(!exists, { F: () => eexist(`create -> email: ${email}`) })))

const _serialise: Types.TSerialiseFn = user => ({
	email: { S: user.email },
	id: { S: user.id },
	email_confirmed: { N: user.email_confirmed ? "1" : "0" },
	handle: { S: user.handle ?? "" },
	password: { S: user.password },
	first_name: { S: user.first_name ?? "" },
	last_name: { S: user.last_name ?? "" },
	created_at: { S: user.created_at.toISOString() },
	subscription: { S: user.subscription },
	file_limit: { N: String(user.file_limit) ?? "1000" },
	max_upload_size: { N: String(user.max_upload_size) ?? "1.5" },
	max_functions: { N: String(user.max_upload_size) ?? "5" },
	code: { S: user.email_code ?? "" },
})

const _deserialize: Types.TDeserialiseFn = item => ({
	email: item.email.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	email_confirmed: item.email_confirmed?.N! === "1",
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	first_name: item.first_name?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	created_at: new Date(item.created_at?.S!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	last_name: item.last_name?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	password: item.password?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	handle: item.handle?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	subscription: item.subscription?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	file_limit: Number(item.file_limit?.N!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	max_upload_size: Number(item.max_upload_size?.N!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	max_functions: Number(item.max_functions?.N!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	email_code: item.email_code?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	id: item.id.S! as SUB,
})
