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

import { combineLatestWith, map } from "rxjs"

import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
import { Result } from "@ordo-pink/result"

import { CurrentUser } from "./user.impl"
import { UserSubscription } from "../constants"

const john_doe: Ordo.User.Current.Instance = CurrentUser.FromDTO({
	created_at: new Date(Date.now()),
	email: "john_doe@ordo.pink",
	email_confirmed: false,
	file_limit: -1,
	handle: "@johndoe",
	id: "58c0d190-0fe5-4daf-be12-5a1ad0b08edc",
	installed_functions: [],
	max_functions: 10,
	max_upload_size: -1,
	subscription: UserSubscription.FREE,
	first_name: "John",
	last_name: "Doe",
})

export const UserQuery: Ordo.User.QueryStatic = {
	Of: (c_repo, k_repo) => ({
		get_current: () => c_repo.get().cata({ Ok: Result.Ok, Err: () => Result.Ok(john_doe) }),
		get_by_id: id =>
			k_repo
				.get()
				.pipe(Oath.ops.map(users => O.FromNullable(users.find(u => u.get_id() === id))))
				.pipe(
					Oath.ops.tap(o => {
						if (o === O.None()) {
							// TODO: Go get remote
						}
					}),
				),
		get $() {
			let i = 0
			return c_repo.$.pipe(combineLatestWith(k_repo.$)).pipe(map(() => ++i))
		},
	}),
}
