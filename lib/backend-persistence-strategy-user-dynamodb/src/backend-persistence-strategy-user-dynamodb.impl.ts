// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import DynamoDB from "aws-sdk/clients/dynamodb"

import {
	type CreateMethod,
	type ExistsByEmailMethod,
	type ExistsByIdMethod,
	type GetByEmailMethod,
	type GetByIdMethod,
	type UpdateMethod,
} from "@ordo-pink/backend-service-user"
import { Oath } from "@ordo-pink/oath"
import { SUB } from "@ordo-pink/wjwt"
import { keys_of } from "@ordo-pink/tau"

import type * as T from "./backend-persistence-strategy-user-dynamodb.types"

// --- Public ---

const strategy: T.Fn = params => ({
	create: create(params),
	update: update(params),
	getById: getById(params),
	getByEmail: getByEmail(params),
	existsById: existsById(params),
	existsByEmail: existsByEmail(params),
})

export const UserPersistenceStrategyDynamoDB = {
	of: ({ accessKeyId, secretAccessKey, region, endpoint, tableName }: T.Config) => {
		const db = new DynamoDB({ credentials: { accessKeyId, secretAccessKey }, region, endpoint })

		return strategy({ db, table: tableName })
	},
}

// --- Internal ---

const existsById: ExistsByIdMethod<T.Params> = params => id =>
	strategy(params)
		.getById(id)
		.map(() => true)
		.fix(() => false)

const existsByEmail: ExistsByEmailMethod<T.Params> = params => email =>
	strategy(params)
		.getByEmail(email)
		.map(() => true)
		.fix(() => false)

const create: CreateMethod<T.Params> =
	({ db, table }) =>
	user =>
		Oath.try(() => {
			return db
				.putItem({
					TableName: table,
					Item: {
						email: { S: user.email },
						id: { S: user.id },
						emailConfirmed: { N: user.emailConfirmed ? "1" : "0" },
						handle: { S: user.handle ?? "" },
						password: { S: user.password },
						firstName: { S: user.firstName ?? "" },
						lastName: { S: user.lastName ?? "" },
						createdAt: { S: user.createdAt.toISOString() },
						subscription: { S: user.subscription },
						fileLimit: { N: String(user.fileLimit) ?? "1000" },
						maxUploadSize: { N: String(user.maxUploadSize) ?? "1.5" },
						code: { S: user.code ?? "" },
					},
				})
				.promise()
		}).map(() => user)

const update: UpdateMethod<T.Params> =
	({ db, table }) =>
	(id, user) =>
		strategy({ db, table })
			.getById(id)
			.chain(oldUser =>
				Oath.of({
					...oldUser,
					firstName: user.firstName ?? oldUser.firstName,
					email: user.email ?? oldUser.email,
					emailConfirmed:
						user.emailConfirmed != null ? user.emailConfirmed : oldUser.emailConfirmed,
					lastName: user.lastName ?? oldUser.lastName,
					handle: user.handle ?? oldUser.handle,
					password: user.password ?? oldUser.password,
					code: user.code ?? oldUser.code,
				})
					.chain(user => Oath.of(reduceUserToAttributeUpdates(user)))
					.chain(AttributeUpdates =>
						Oath.from(() =>
							db
								.updateItem({ TableName: table, Key: { id: { S: id } }, AttributeUpdates })
								.promise(),
						),
					)
					.map(() => ({ ...oldUser, ...user })),
			)

const getById: GetByIdMethod<T.Params> =
	({ db, table }) =>
	id =>
		Oath.try(() => db.getItem({ TableName: table, Key: { id: { S: id } } }).promise())
			.chain(({ Item }) => Oath.fromNullable(Item).rejectedMap(() => new Error("User not found")))
			.map(serialize)

const getByEmail: GetByEmailMethod<T.Params> =
	({ db, table }) =>
	email =>
		Oath.try(() =>
			db
				.scan({
					TableName: table,
					FilterExpression: "email = :e",
					ExpressionAttributeValues: { ":e": { S: email } },
				})
				.promise(),
		)
			.chain(output => Oath.fromNullable(output.Items))
			.chain(items => Oath.fromNullable(items[0]))
			.map(serialize)

const serialize: T._SerializeFn = item => ({
	email: item.email.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	emailConfirmed: item.emailConfirmed?.N! === "1",
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	firstName: item.firstName?.S!,
	createdAt: new Date(item.createdAt.S!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	lastName: item.lastName?.S!,
	password: item.password.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	handle: item.handle?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	subscription: item.subscription?.S!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	fileLimit: Number(item.fileLimit?.N!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	maxUploadSize: Number(item.maxUploadSize?.N!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	code: item.code?.S!,
	id: item.id.S! as SUB,
})

const reduceUserToAttributeUpdates: T._ReduceUserToAttributeUpdatesFn = user =>
	keys_of(user).reduce((AttributeUpdates, key) => {
		if (key === "id" || key === "createdAt") return AttributeUpdates

		if (
			key === "email" ||
			key === "firstName" ||
			key === "lastName" ||
			key === "password" ||
			key === "handle" ||
			key === "code" ||
			key === "subscription"
		) {
			AttributeUpdates[key] = {
				Action: "PUT",
				Value: { S: user[key] },
			}
		}

		if (key === "fileLimit" || key === "maxUploadSize") {
			AttributeUpdates[key] = {
				Action: "PUT",
				Value: { N: String(user[key]) },
			}
		}

		if (key === "emailConfirmed") {
			AttributeUpdates[key] = {
				Action: "PUT",
				Value: { N: user[key] ? "1" : "0" },
			}
		}

		return AttributeUpdates
	}, {} as ReturnType<T._ReduceUserToAttributeUpdatesFn>)
