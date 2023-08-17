// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type {
	DynamoDB,
	GetItemOutput,
	UpdateItemInput,
} from "#x/aws_api@v0.8.1/services/dynamodb/mod.ts"
import type { Unary } from "@ordo-pink/tau/mod.ts"
import type { InternalUser, UserRepository } from "@ordo-pink/backend-user-service/mod.ts"

// --- Public ---

export type Params = { db: DynamoDB; table: string }
export type Fn = (params: Params) => UserRepository
export type Config = {
	region: string
	endpoint: string
	awsAccessKeyId: string
	awsSecretKey: string
	tableName: string
}

// --- Internal ---

export type _SerializeFn = Unary<NonNullable<GetItemOutput["Item"]>, InternalUser>
export type _ReduceUserToAttributeUpdatesFn = Unary<
	Partial<InternalUser>,
	NonNullable<UpdateItemInput["AttributeUpdates"]>
>
