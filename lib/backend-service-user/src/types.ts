// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Method, Nullable } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { User } from "@ordo-pink/frontend-core"

export type UserPersistenceStrategy = {
	existsById: (id: string) => Oath<boolean, Error>
	existsByEmail: (email: string) => Oath<boolean, Error>
	create(user: User.InternalUser): Oath<User.InternalUser, Error>
	getById(id: string): Oath<User.InternalUser, Error> | null
	getByEmail(email: string): Oath<User.InternalUser, Error> | null
	update(id: string, user: Partial<User.InternalUser>): Oath<User.InternalUser, Error> | null
	// remove: (id: string) => Promise<InternalUser | null>
}

export type CreateMethod<P> = Method<P, UserPersistenceStrategy, "create">
export type GetByEmailMethod<P> = Method<P, UserPersistenceStrategy, "getByEmail">
export type GetByIdMethod<P> = Method<P, UserPersistenceStrategy, "getById">
export type ExistsByEmailMethod<P> = Method<P, UserPersistenceStrategy, "existsByEmail">
export type ExistsByIdMethod<P> = Method<P, UserPersistenceStrategy, "existsById">
export type UpdateMethod<P> = Method<P, UserPersistenceStrategy, "update">
