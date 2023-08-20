// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type * as T from "./types"
import { DynamoDB } from "aws-sdk"
import { keysOf } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import {
	ExistsByIdMethod,
	ExistsByEmailMethod,
	CreateMethod,
	UpdateMethod,
	GetByIdMethod,
	GetByEmailMethod,
} from "@ordo-pink/backend-user-service"

// --- Public ---

const repository: T.Fn = params => ({
	create: create(params),
	update: update(params),
	getById: getById(params),
	getByEmail: getByEmail(params),
	existsById: existsById(params),
	existsByEmail: existsByEmail(params),
})

export const DynamoDBUserStorageAdapter = {
	of: ({ awsAccessKeyId, awsSecretKey, region, endpoint, tableName }: T.Config) => {
		const db = new DynamoDB({
			credentials: { accessKeyId: awsAccessKeyId, secretAccessKey: awsSecretKey }, // TODO: Fix names
			region,
			endpoint,
		})

		return repository({ db, table: tableName })
	},
}

// --- Internal ---

const existsById: ExistsByIdMethod<T.Params> = params => id =>
	repository(params)
		.getById(id)
		.map(() => true)
		.fix(() => false)

const existsByEmail: ExistsByEmailMethod<T.Params> = params => email =>
	repository(params)
		.getByEmail(email)
		.map(() => true)
		.fix(() => false)

const create: CreateMethod<T.Params> =
	({ db, table }) =>
	user =>
		Oath.try(() =>
			db.putItem({
				TableName: table,
				Item: {
					email: { S: user.email },
					id: { S: user.id },
					emailConfirmed: { N: user.emailConfirmed ? "1" : "0" },
					username: { S: user.username ?? "" },
					password: { S: user.password },
					firstName: { S: user.firstName ?? "" },
					lastName: { S: user.lastName ?? "" },
					createdAt: { S: user.createdAt.toISOString() },
				},
			}),
		).map(() => user)

const update: UpdateMethod<T.Params> =
	({ db, table }) =>
	(id, user) =>
		repository({ db, table })
			.getById(id)
			.chain(oldUser =>
				Oath.resolve(reduceUserToAttributeUpdates(oldUser))
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
	email: item.email!.S!,
	emailConfirmed: item.emailConfirmed!.N! === "1",
	firstName: item.firstName!.S!,
	createdAt: new Date(item.createdAt!.S!),
	lastName: item.lastName!.S!,
	password: item.password!.S!,
	username: item.username!.S!,
	id: item.id!.S!,
})

const reduceUserToAttributeUpdates: T._ReduceUserToAttributeUpdatesFn = user =>
	keysOf(user).reduce((AttributeUpdates, key) => {
		if (key === "id" || key === "createdAt") return AttributeUpdates

		if (
			key === "email" ||
			key === "firstName" ||
			key === "lastName" ||
			key === "password" ||
			key === "username"
		) {
			AttributeUpdates[key] = {
				Action: "PUT",
				Value: { S: user[key] },
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
