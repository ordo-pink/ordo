// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type {
	DynamoDB,
	GetItemOutput,
	UpdateItemInput,
} from "#x/aws_api@v0.8.1/services/dynamodb/mod.ts"
import type { InternalUser, Adapter } from "#lib/user-service/mod.ts"
import type { T as TAU } from "#lib/tau/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export type Params = { db: DynamoDB; table: string }
export type Fn = (params: Params) => Adapter
export type Config = {
	region: string
	endpoint: string
	awsAccessKeyId: string
	awsSecretKey: string
	tableName: string
}

// INTERNAL ---------------------------------------------------------------------------------------

export type _SerializeFn = TAU.Unary<NonNullable<GetItemOutput["Item"]>, InternalUser>
export type _ReduceUserToAttributeUpdatesFn = TAU.Unary<
	Partial<InternalUser>,
	NonNullable<UpdateItemInput["AttributeUpdates"]>
>
