/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { Oath } from "@ordo-pink/oath"
import type { TResult } from "@ordo-pink/result"
import type { TValidations } from "@ordo-pink/core"

export type TPersistenceStrategyUser = {
	create: (user: OrdoInternal.User.PrivateDTO) => Oath<void, Ordo.Rrr<"EIO" | "EEXIST">>
	update: (
		id: OrdoInternal.User.PrivateDTO["id"],
		user: OrdoInternal.User.PrivateDTO,
	) => Oath<OrdoInternal.User.PrivateDTO, Ordo.Rrr<"EIO" | "ENOENT">>
	exists_by_id: (id: OrdoInternal.User.PrivateDTO["id"]) => Oath<boolean, Ordo.Rrr<"EIO">>
	exists_by_email: (email: OrdoInternal.User.PrivateDTO["email"]) => Oath<boolean, Ordo.Rrr<"EIO">>
	exists_by_handle: (handle: OrdoInternal.User.PrivateDTO["handle"]) => Oath<boolean, Ordo.Rrr<"EIO">>
	get_by_id: (id: OrdoInternal.User.PrivateDTO["id"]) => Oath<OrdoInternal.User.PrivateDTO, Ordo.Rrr<"EIO" | "ENOENT">>
	get_by_email: (email: OrdoInternal.User.PrivateDTO["email"]) => Oath<OrdoInternal.User.PrivateDTO, Ordo.Rrr<"EIO" | "ENOENT">>
	get_by_handle: (
		handle: OrdoInternal.User.PrivateDTO["handle"],
	) => Oath<OrdoInternal.User.PrivateDTO, Ordo.Rrr<"EIO" | "ENOENT">>
	remove: (id: OrdoInternal.User.PrivateDTO["id"]) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>
}

export type TUserValidation<$TKey extends keyof OrdoInternal.User.PrivateDTO> = (
	x: unknown,
) => TResult<OrdoInternal.User.PrivateDTO[$TKey], Ordo.Rrr<"EINVAL">>

export type TUserValidations = TValidations<OrdoInternal.User.PrivateDTO>

export type TUserServiceStatic = {
	get ENTITY_VERSION(): number
	Validations: TUserValidations
	of: (persistence_strategy: TPersistenceStrategyUser) => TUserService
	serialise: <$TUser extends OrdoInternal.User.PrivateDTO>(user: $TUser) => OrdoInternal.User.PrivateDTO
	serialise_public: <$TUser extends Ordo.User.Public.Instance>(user: $TUser) => Ordo.User.Public.Instance
	serialise_internal: <$TUser extends OrdoInternal.User.InternalDTO>(user: $TUser) => OrdoInternal.User.InternalDTO
	create_email_code: () => string
	obfuscate_email: (email: OrdoInternal.User.PrivateDTO["email"]) => string
	create_id: () => OrdoInternal.User.PrivateDTO["id"]
}

export type TUserService = {
	strategy: TPersistenceStrategyUser

	create: (
		email: string,
		handle: string,
		password: string,
	) => Oath<OrdoInternal.User.InternalDTO, Ordo.Rrr<"EIO" | "EEXIST" | "EINVAL">>

	migrate: () => Oath<void, Ordo.Rrr<"EIO" | "EEXIST" | "EINVAL" | "ENOENT">>

	update_email: (
		id: string,
		email: string,
	) => Oath<OrdoInternal.User.InternalDTO["email_code"], Ordo.Rrr<"EIO" | "ENOENT" | "EEXIST" | "EINVAL">>

	update_handle: (id: string, handle: string) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT" | "EEXIST" | "EINVAL">>

	update_password: (id: string, new_password: string) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>

	update_info: (
		id: string,
		increment: Pick<OrdoInternal.User.PrivateDTO, "last_name" | "first_name">,
	) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>

	update_subscription: (
		id: string,
		increment: Pick<OrdoInternal.User.PrivateDTO, "subscription" | "max_upload_size" | "file_limit" | "max_functions">,
	) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>

	confirm_email: (id: string, code: string) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>

	compare_password: (email_or_handle: string, password: string) => Oath<boolean, Ordo.Rrr<"ENOENT" | "EIO" | "EINVAL">>

	get_by_id: (id: string) => Oath<OrdoInternal.User.InternalDTO, Ordo.Rrr<"EIO" | "EINVAL">>

	get_by_email: (email: string) => Oath<OrdoInternal.User.InternalDTO, Ordo.Rrr<"EIO" | "EINVAL">>

	get_by_handle: (handle: string) => Oath<OrdoInternal.User.InternalDTO, Ordo.Rrr<"EIO" | "EINVAL">>
}
