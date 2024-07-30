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

import { TUserQueryStatic } from "./user-query.types"

export const UserQuery: TUserQueryStatic = {
	of: (c_repo, k_repo) => ({
		get_current: c_repo.get,
		get_by_email: email =>
			k_repo
				.get()
				.pipe(Oath.ops.map(users => O.FromNullable(users.find(u => u.email === email))))
				.pipe(
					Oath.ops.tap(o => {
						if (o === O.None()) {
							// TODO: Go get remote
						}
					}),
				),
		get current_user_version$() {
			let i = 0
			return c_repo.version$.pipe(combineLatestWith(k_repo.version$)).pipe(map(() => ++i))
		},
	}),
}
