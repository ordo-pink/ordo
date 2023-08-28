// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Method, Nullable } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"

export type PublicUser = {
	email: string
	handle?: string
	createdAt: Date
	firstName?: string
	lastName?: string
}

export type User = PublicUser & {
	id: string
	emailConfirmed: boolean
}

export type InternalUser = User & {
	password: string
}

export type UserRepository = {
	existsById: (id: string) => Oath<boolean, Error>
	existsByEmail: (email: string) => Oath<boolean, Error>
	create(user: InternalUser): Oath<InternalUser, Error>
	getById(id: string): Oath<InternalUser, Nullable<Error>>
	getByEmail(email: string): Oath<InternalUser, Nullable<Error>>
	update(id: string, user: Partial<InternalUser>): Oath<InternalUser, Nullable<Error>>
	// remove: (id: string) => Promise<Nullable<InternalUser>>
}

export type CreateMethod<P> = Method<P, UserRepository, "create">
export type GetByEmailMethod<P> = Method<P, UserRepository, "getByEmail">
export type GetByIdMethod<P> = Method<P, UserRepository, "getById">
export type ExistsByEmailMethod<P> = Method<P, UserRepository, "existsByEmail">
export type ExistsByIdMethod<P> = Method<P, UserRepository, "existsById">
export type UpdateMethod<P> = Method<P, UserRepository, "update">
