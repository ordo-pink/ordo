import type { InternalUser, UserAdapter } from "#lib/user-service/mod.ts"
import type { DynamoDBUserDriverConfig } from "./types.ts"

import { ApiFactory } from "#x/aws_api@v0.8.1/client/mod.ts"
import {
	DynamoDB,
	GetItemOutput,
	UpdateItemInput,
} from "#x/aws_api@v0.8.1/services/dynamodb/mod.ts"

import { keysOf } from "#lib/tau/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// TODO: Clean up
export class DynamoDBUserAdapter implements UserAdapter {
	#driver: DynamoDB
	#tableName: string

	public static of({
		awsAccessKeyId,
		awsSecretKey,
		region,
		endpoint,
		tableName,
	}: DynamoDBUserDriverConfig) {
		const credentials = { awsAccessKeyId, awsSecretKey }
		const fixedEndpoint = endpoint
		const factory = new ApiFactory({ credentials, region, fixedEndpoint })
		const dynamodb = factory.makeNew(DynamoDB)

		return new DynamoDBUserAdapter(dynamodb, tableName)
	}

	protected constructor(driver: DynamoDB, tableName: string) {
		this.#driver = driver
		this.#tableName = tableName
	}

	public create(user: InternalUser): Oath<InternalUser, "User already exists"> {
		return Oath.from(() =>
			this.#driver.putItem({
				TableName: this.#tableName,
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
			})
		).bimap(
			() => "User already exists",
			() => user
		)
	}

	public getById(id: string): Oath<InternalUser, null> {
		return Oath.from(() =>
			this.#driver.getItem({
				TableName: this.#tableName,
				Key: { id: { S: id } },
			})
		)
			.chain(output => Oath.fromNullable(output.Item))
			.map(item => this.serialize(item))
	}

	public getByEmail(email: string): Oath<InternalUser, null> {
		return Oath.from(() =>
			this.#driver.scan({
				TableName: this.#tableName,
				FilterExpression: "email = :e",
				ExpressionAttributeValues: { ":e": { S: email } },
			})
		)
			.chain(output => Oath.fromNullable(output.Items))
			.chain(items => Oath.fromNullable(items[0]))
			.map(item => this.serialize(item))
	}

	public update(id: string, user: Partial<InternalUser>): Oath<InternalUser, null> {
		return this.getById(id)
			.chain(user => Oath.fromNullable(user))
			.chain(oldUser =>
				Oath.resolve(
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
					}, {} as NonNullable<UpdateItemInput["AttributeUpdates"]>)
				)
					.chain(AttributeUpdates =>
						Oath.from(() =>
							this.#driver.updateItem({
								TableName: this.#tableName,
								Key: { id: { S: id } },
								AttributeUpdates,
							})
						)
					)
					.map(() => ({ ...oldUser, ...user } as InternalUser))
			)
	}

	private serialize(item: NonNullable<GetItemOutput["Item"]>): InternalUser {
		return {
			email: item.email!.S!,
			emailConfirmed: item.emailConfirmed!.N! === "1",
			firstName: item.firstName!.S!,
			createdAt: new Date(item.createdAt!.S!),
			lastName: item.lastName!.S!,
			password: item.password!.S!,
			username: item.username!.S!,
			id: item.id!.S!,
		}
	}
}
