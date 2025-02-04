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

import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { noop } from "@ordo-pink/tau"

import type * as T from "./backend-persistence-strategy-user-dynamodb.types"

let dynamo_db: DynamoDB

export const PersistenceStrategyUserDynamoDB: T.TPersistenceStrategyDynamoDBStatic = {
	Of: (dynamo_db_config: T.TDynamoDBConfig) => {
		const { access_key, secret_key, region, endpoint, table_name } = dynamo_db_config
		const TableName = table_name
		const credentials = { accessKeyId: access_key, secretAccessKey: secret_key }

		if (!dynamo_db) dynamo_db = new DynamoDB({ region, endpoint, credentials })

		return {
			create: user =>
				Oath.Merge([
					_check_not_exists_by_email0(dynamo_db_config, user.email),
					_check_not_exists_by_id0(dynamo_db_config, user.id),
					_check_not_exists_by_handle0(dynamo_db_config, user.handle),
				])
					.pipe(ops0.map(() => _serialise(user)))
					.pipe(
						ops0.chain(Item =>
							Oath.Try(() => dynamo_db.putItem({ TableName, Item }))
								.pipe(ops0.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message))),
						),
					)
					.pipe(ops0.map(() => user)),

			update: (id, user) =>
				PersistenceStrategyUserDynamoDB.Of(dynamo_db_config)
					.exists_by_id(id)
					.pipe(ops0.chain(exists => Oath.If(exists, { F: () => RRR.codes.enoent("User not found") })))
					.pipe(ops0.map(() => ({ Key: { id: { S: id } }, Item: _serialise(user) })))
					.pipe(
						ops0.chain(params =>
							Oath.Try(() => dynamo_db.putItem({ TableName, ...params }))
								.pipe(ops0.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message))),
						),
					)
					.pipe(ops0.map(() => user)),

			get_by_id: id =>
				Oath.Resolve({ id: { S: id } })
					.pipe(
						ops0.chain(Key =>
							Oath.Try(() => dynamo_db.getItem({ TableName, Key }))
								.pipe(ops0.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message))),
						),
					)
					.pipe(ops0.chain(({ Item }) => Oath.FromNullable(Item).pipe(ops0.rejected_map(not_found_rrr))))
					.pipe(ops0.map(_deserialize)),

			get_by_email: email =>
				Oath.Resolve({
					FilterExpression: "email = :e",
					ExpressionAttributeValues: { ":e": { S: email } },
				})
					.pipe(
						ops0.chain(params =>
							Oath.Try(() => dynamo_db.scan({ TableName, ...params }))
								.pipe(ops0.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message))),
						),
					)
					.pipe(ops0.chain(out => Oath.FromNullable(out.Items?.[0]).pipe(ops0.rejected_map(not_found_rrr))))
					.pipe(ops0.map(_deserialize)),

			get_by_handle: handle =>
				Oath.Resolve({
					FilterExpression: "handle = :e",
					ExpressionAttributeValues: { ":e": { S: handle } },
				})
					.pipe(
						ops0.chain(params =>
							Oath.Try(() => dynamo_db.scan({ TableName, ...params }))
								.pipe(ops0.chain(req => Oath.FromPromise(() => req.promise())))
								.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message))),
						),
					)
					.pipe(ops0.chain(out => Oath.FromNullable(out.Items?.[0]).pipe(ops0.rejected_map(not_found_rrr))))
					.pipe(ops0.map(_deserialize)),

			exists_by_id: id =>
				PersistenceStrategyUserDynamoDB.Of(dynamo_db_config)
					.get_by_id(id)
					.pipe(ops0.map(() => true))
					.fix(() => false),

			exists_by_email: email =>
				PersistenceStrategyUserDynamoDB.Of(dynamo_db_config)
					.get_by_email(email)
					.pipe(ops0.map(() => true))
					.fix(() => false),

			exists_by_handle: handle =>
				PersistenceStrategyUserDynamoDB.Of(dynamo_db_config)
					.get_by_handle(handle)
					.pipe(ops0.map(() => true))
					.fix(() => false),

			remove: id =>
				PersistenceStrategyUserDynamoDB.Of(dynamo_db_config)
					.exists_by_id(id)
					.pipe(ops0.chain(exists => Oath.If(exists, { F: () => RRR.codes.enoent("User not found") })))
					.pipe(ops0.map(() => ({ id: { S: id } })))
					.pipe(ops0.chain(Key => Oath.Try(() => dynamo_db.deleteItem({ Key, TableName }))))
					.pipe(ops0.chain(req => Oath.FromPromise(() => req.promise())))
					.pipe(ops0.rejected_map(e => RRR.codes.eio(e.message)))
					.pipe(ops0.map(noop)),
		}
	},
}

// --- Internal ---

const not_found_rrr = () => RRR.codes.enoent("User not found")

const _check_not_exists_by_handle0 = (params: T.TDynamoDBConfig, handle: Ordo.User.Handle) =>
	PersistenceStrategyUserDynamoDB.Of(params)
		.exists_by_handle(handle)
		.pipe(ops0.chain(exists => Oath.If(!exists, { F: () => RRR.codes.eexist(`User already exists: handle ${handle}`) })))

const _check_not_exists_by_id0 = (params: T.TDynamoDBConfig, id: Ordo.User.ID) =>
	PersistenceStrategyUserDynamoDB.Of(params)
		.exists_by_id(id)
		.pipe(ops0.chain(exists => Oath.If(!exists, { F: () => RRR.codes.eexist(`User already exists: id ${id}`) })))

const _check_not_exists_by_email0 = (params: T.TDynamoDBConfig, email: Ordo.User.Email) =>
	PersistenceStrategyUserDynamoDB.Of(params)
		.exists_by_email(email)
		.pipe(ops0.chain(exists => Oath.If(!exists, { F: () => RRR.codes.eexist(`User already exists: email ${email}`) })))

const _serialise: T.TSerialiseFn = user => ({
	email: { S: user.email },
	id: { S: user.id },
	email_code: { N: user.email_code ?? "" },
	handle: { S: user.handle },
	password: { S: user.password ?? "" },
	first_name: { S: user.first_name ?? "" },
	last_name: { S: user.last_name ?? "" },
	created_at: { N: String(user.created_at) },
	subscription: { N: String(user.subscription) },
	file_limit: { N: String(user.file_limit) },
	max_upload_size: { N: String(user.max_upload_size) },
	max_functions: { N: String(user.max_upload_size) },
	installed_functions: { SS: user.installed_functions },
})

const _deserialize: T.TDeserialiseFn = item => ({
	email: item.email.S as Ordo.User.Email,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	code: item.code?.N!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	first_name: item.first_name?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	created_at: Number.parseInt(item.created_at?.N!, 10),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	last_name: item.last_name?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	password: item.password?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	handle: item.handle?.S as Ordo.User.Handle,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	subscription: Number.parseInt(item.subscription?.N!, 10),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	file_limit: Number.parseInt(item.file_limit?.N!, 10),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	max_upload_size: Number.parseInt(item.max_upload_size?.N!, 10),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	max_functions: Number.parseInt(item.max_functions?.N!, 10),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	email_code: item.email_code?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	id: item.id.S! as Ordo.User.ID,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	installed_functions: item.installed_functions.SS!,
})
