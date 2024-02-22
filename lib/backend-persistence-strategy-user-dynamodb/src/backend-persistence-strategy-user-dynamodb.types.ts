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

import { DynamoDB } from "aws-sdk"
import type { Unary } from "@ordo-pink/tau"
import type { UserPersistenceStrategy } from "@ordo-pink/backend-service-user"

// --- Public ---

export type Params = { db: DynamoDB; table: string }
export type Fn = (params: Params) => UserPersistenceStrategy
export type Config = {
	region: string
	endpoint: string
	accessKeyId: string
	secretAccessKey: string
	tableName: string
}

// --- Internal ---

export type _SerializeFn = Unary<NonNullable<DynamoDB.GetItemOutput["Item"]>, User.InternalUser>
export type _ReduceUserToAttributeUpdatesFn = Unary<
	Partial<User.InternalUser>,
	NonNullable<DynamoDB.UpdateItemInput["AttributeUpdates"]>
>
