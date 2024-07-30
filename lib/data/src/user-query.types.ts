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

import type { Observable } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { TCurrentUserRepository, TKnownUsersRepository } from "./user-repository.types"
import type { TRrr } from "./metadata.errors"

export type TGetCurrentUserFn = () => TResult<User.User, TRrr<"EAGAIN">>

export type TGetCurrentUserByIDFn = (
	id: User.User["id"],
) => Oath<TOption<User.User>, TRrr<"EAGAIN" | "EINVAL" | "EIO">>

export type TGetPublicUserByEmailFn = (
	email: User.User["email"],
) => Oath<TOption<User.PublicUser>, TRrr<"EAGAIN" | "EINVAL" | "EIO">>

export type TGetPublicUserByHandleFn = (
	handle: User.User["handle"],
) => Oath<TOption<User.PublicUser>, TRrr<"EAGAIN" | "EINVAL" | "EIO">>

export type TUserQuery = {
	get_current: TGetCurrentUserFn
	// get_current_by_id: TGetCurrentUserByIDFn
	get_by_email: TGetPublicUserByEmailFn
	// get_by_handle: TGetPublicUserByHandleFn
	get current_user_version$(): Observable<number>
}

export type TUserQueryStatic = {
	of: (
		current_user_repository: TCurrentUserRepository,
		known_user_repository: TKnownUsersRepository,
	) => TUserQuery
}
