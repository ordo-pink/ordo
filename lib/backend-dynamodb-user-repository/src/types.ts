// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type {
	DynamoDB,
	GetItemOutput,
	UpdateItemInput,
} from "#x/aws_api@v0.8.1/services/dynamodb/mod.ts"
import type { Unary } from "#lib/tau/mod.ts"
import type { InternalUser, UserRepository } from "#lib/backend-user-service/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export type Params = { db: DynamoDB; table: string }
export type Fn = (params: Params) => UserRepository
export type Config = {
	region: string
	endpoint: string
	awsAccessKeyId: string
	awsSecretKey: string
	tableName: string
}

// INTERNAL ---------------------------------------------------------------------------------------

export type _SerializeFn = Unary<NonNullable<GetItemOutput["Item"]>, InternalUser>
export type _ReduceUserToAttributeUpdatesFn = Unary<
	Partial<InternalUser>,
	NonNullable<UpdateItemInput["AttributeUpdates"]>
>
