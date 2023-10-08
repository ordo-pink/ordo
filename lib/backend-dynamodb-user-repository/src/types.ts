// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { DynamoDB } from "aws-sdk"
import type { Unary } from "@ordo-pink/tau"
import type { UserRepository } from "@ordo-pink/backend-user-service"
import { User } from "@ordo-pink/frontend-core"

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

export type _SerializeFn = Unary<NonNullable<DynamoDB.GetItemOutput["Item"]>, User.InternalUser>
export type _ReduceUserToAttributeUpdatesFn = Unary<
	Partial<User.InternalUser>,
	NonNullable<DynamoDB.UpdateItemInput["AttributeUpdates"]>
>
