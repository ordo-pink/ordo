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

import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"
import type { TRrr } from "@ordo-pink/data"
import { TValidations } from "@ordo-pink/tau"

export type TPersistenceStrategyUser = {
	create: (user: User.PrivateUser) => Oath<void, TRrr<"EIO" | "EEXIST">>
	update: (
		id: User.User["id"],
		user: User.PrivateUser,
	) => Oath<User.PrivateUser, TRrr<"EIO" | "ENOENT">>
	exists_by_id: (id: User.User["id"]) => Oath<boolean, TRrr<"EIO">>
	exists_by_email: (email: User.User["email"]) => Oath<boolean, TRrr<"EIO">>
	exists_by_handle: (handle: User.User["handle"]) => Oath<boolean, TRrr<"EIO">>
	get_by_id: (id: User.User["id"]) => Oath<TOption<User.PrivateUser>, TRrr<"EIO">>
	get_by_email: (email: User.User["email"]) => Oath<TOption<User.PrivateUser>, TRrr<"EIO">>
	get_by_handle: (handle: User.User["handle"]) => Oath<TOption<User.PrivateUser>, TRrr<"EIO">>
	migrate: (entity_version: User.PrivateUser["entity_version"]) => Oath<void, TRrr<"EIO">>
	get_outdated: (
		version: User.PrivateUser["entity_version"],
	) => Oath<User.PrivateUser[], TRrr<"EIO">>
	// remove: (id: string) => Promise<PrivateUser | null>
}

export type TUserValidation<$TKey extends keyof User.PrivateUser> = (
	x: unknown,
) => TResult<User.PrivateUser[$TKey], TRrr<"EINVAL">>

// export type TValidations = { [K in keyof User.PrivateUser]: TUserValidation<K> }
// export type TUserValidations<$TKey extends keyof TValidations = keyof TValidations> = Record<
// 	`is_${$TKey}`,
// 	TValidations[$TKey]
// >

export type TUserValidations = TValidations<User.PrivateUser>

export type TUserServiceStatic = {
	get ENTITY_VERSION(): number
	Validations: TUserValidations
	of: (persistence_strategy: TPersistenceStrategyUser) => TUserService
	serialise: <$TUser extends User.User>(user: $TUser) => User.User
	serialise_public: <$TUser extends User.PublicUser>(user: $TUser) => User.PublicUser
	serialise_internal: <$TUser extends User.InternalUser>(user: $TUser) => User.InternalUser
	create_email_code: () => string
	obfuscate_email: (email: User.User["email"]) => string
	create_id: () => User.User["id"]
}

export type TUserService = {
	strategy: TPersistenceStrategyUser

	create: (
		email: string,
		handle: string,
		password: string,
	) => Oath<User.InternalUser, TRrr<"EIO" | "EEXIST" | "EINVAL">>

	migrate: () => Oath<void, TRrr<"EIO" | "EEXIST" | "EINVAL" | "ENOENT">>

	update_email: (
		id: string,
		email: string,
	) => Oath<User.InternalUser["email_code"], TRrr<"EIO" | "ENOENT" | "EEXIST" | "EINVAL">>

	update_handle: (
		id: string,
		handle: string,
	) => Oath<void, TRrr<"EIO" | "ENOENT" | "EEXIST" | "EINVAL">>

	update_password: (
		id: string,
		new_password: string,
	) => Oath<void, TRrr<"EIO" | "ENOENT" | "EINVAL">>

	update_info: (
		id: string,
		increment: Pick<User.User, "last_name" | "first_name">,
	) => Oath<void, TRrr<"EIO" | "ENOENT" | "EINVAL">>

	update_subscription: (
		id: string,
		increment: Pick<User.User, "subscription" | "max_upload_size" | "file_limit" | "max_functions">,
	) => Oath<void, TRrr<"EIO" | "ENOENT" | "EINVAL">>

	confirm_email: (id: string, code: string) => Oath<void, TRrr<"EIO" | "ENOENT" | "EINVAL">>

	compare_password: (
		email_or_handle: string,
		password: string,
	) => Oath<boolean, TRrr<"ENOENT" | "EIO" | "EINVAL">>

	get_by_id: (id: string) => Oath<TOption<User.InternalUser>, TRrr<"EIO" | "EINVAL">>

	get_by_email: (email: string) => Oath<TOption<User.InternalUser>, TRrr<"EIO" | "EINVAL">>

	get_by_handle: (handle: string) => Oath<TOption<User.InternalUser>, TRrr<"EIO" | "EINVAL">>
}
