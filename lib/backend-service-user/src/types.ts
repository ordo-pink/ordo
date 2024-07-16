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

export type TUserPersistenceStrategy = {
	exists_by_id: (id: User.User["id"]) => Oath<boolean, TRrr<"EIO">>
	exists_by_email: (email: string) => Oath<boolean, TRrr<"EIO">>
	exists_by_handle: (handle: string) => Oath<boolean, TRrr<"EIO">>
	create: (user: User.InternalUser) => Oath<void, TRrr<"EIO" | "EEXIST">>
	get_by_id: (id: User.User["id"]) => Oath<TOption<User.InternalUser>, TRrr<"EIO">>
	get_by_email: (email: string) => Oath<TOption<User.InternalUser>, TRrr<"EIO">>
	get_by_handle: (handle: string) => Oath<TOption<User.InternalUser>, TRrr<"EIO">>
	update: (id: User.User["id"], user: User.InternalUser) => Oath<void, TRrr<"EIO" | "ENOENT">>
	// remove: (id: string) => Promise<InternalUser | null>
}
