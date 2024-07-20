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

import { Oath } from "@ordo-pink/oath"
import { TOption } from "@ordo-pink/option"
import { TRrr } from "@ordo-pink/data"

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
	// remove: (id: string) => Promise<PrivateUser | null>
}

export type TUserServiceStatic = {
	of: (persistence_strategy: TPersistenceStrategyUser) => TUserService
	serialise_public: (user: User.PublicUser) => User.PublicUser
	serialise_internal: (user: User.InternalUser) => User.InternalUser
	serialise: (user: User.User) => User.User
	create_email_code: () => string
	obfuscate_email: (email: User.User["email"]) => string
	create_id: () => User.User["id"]
}

export type TUserService = {
	strategy: TPersistenceStrategyUser

	create: (
		email: User.User["email"],
		handle: User.User["handle"],
		password: User.PrivateUser["password"],
	) => Oath<User.InternalUser, TRrr<"EIO" | "EEXIST">>

	update_email: (
		id: User.User["id"],
		email: User.User["email"],
	) => Oath<User.InternalUser["email_code"], TRrr<"EIO" | "ENOENT" | "EEXIST">>

	update_handle: (
		id: User.User["id"],
		handle: User.User["handle"],
	) => Oath<void, TRrr<"EIO" | "ENOENT" | "EEXIST">>

	update_password: (
		id: User.User["id"],
		old_password: User.PrivateUser["password"],
		new_password: User.PrivateUser["password"],
	) => Oath<void, TRrr<"EIO" | "ENOENT">>

	update_info: (
		id: User.User["id"],
		increment: Pick<User.User, "last_name" | "first_name">,
	) => Oath<void, TRrr<"EIO" | "ENOENT">>

	update_subscription: (
		id: User.User["id"],
		increment: Pick<User.User, "subscription" | "max_upload_size" | "file_limit" | "max_functions">,
	) => Oath<void, TRrr<"EIO" | "ENOENT">>

	compare_password: (
		email_or_handle: User.User["email"] | User.User["handle"],
		password: User.PrivateUser["password"],
	) => Oath<boolean, TRrr<"ENOENT" | "EIO">>

	get_by_id: (id: User.User["id"]) => Oath<TOption<User.InternalUser>, TRrr<"EIO">>

	get_by_email: (email: User.User["email"]) => Oath<TOption<User.InternalUser>, TRrr<"EIO">>

	get_by_handle: (handle: User.User["handle"]) => Oath<TOption<User.InternalUser>, TRrr<"EIO">>
}
