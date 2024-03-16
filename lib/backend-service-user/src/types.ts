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

import { Method } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"

export type UserPersistenceStrategy = {
	existsById: (id: string) => Oath<boolean, Error>
	existsByEmail: (email: string) => Oath<boolean, Error>
	create(user: User.InternalUser): Oath<User.InternalUser, Error>
	getById(id: string): Oath<User.InternalUser, Error | null>
	getByEmail(email: string): Oath<User.InternalUser, Error | null>
	update(id: string, user: Partial<User.InternalUser>): Oath<User.InternalUser, Error | null>
	// remove: (id: string) => Promise<InternalUser | null>
}

export type CreateMethod<P> = Method<P, UserPersistenceStrategy, "create">
export type GetByEmailMethod<P> = Method<P, UserPersistenceStrategy, "getByEmail">
export type GetByIdMethod<P> = Method<P, UserPersistenceStrategy, "getById">
export type ExistsByEmailMethod<P> = Method<P, UserPersistenceStrategy, "existsByEmail">
export type ExistsByIdMethod<P> = Method<P, UserPersistenceStrategy, "existsById">
export type UpdateMethod<P> = Method<P, UserPersistenceStrategy, "update">
