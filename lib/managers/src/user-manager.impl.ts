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
import { noop } from "@ordo-pink/tau"

import { TCurrentUserManagerStatic } from "./user-manager.types"

export const CurrentUserManager: TCurrentUserManagerStatic = {
	of: (local_repo, remote_repo, auth$) => ({
		start: on_state_change =>
			// TODO: Cache/offline repo
			auth$
				.pipe(map(auth_option => O.FromNullable(auth_option.unwrap()?.token)))
				.pipe(combineLatestWith(local_repo.$))
				.pipe(
					map(([token_option, iteration]) => {
						if (iteration === 0) {
							void Oath.FromNullable(token_option.unwrap())
								.pipe(Oath.ops.tap(() => on_state_change("get-remote")))
								.pipe(Oath.ops.chain(remote_repo.get))
								.pipe(Oath.ops.tap(() => on_state_change("get-remote-complete")))
								.pipe(Oath.ops.map(user => local_repo.put(user)))
								.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
								.invoke(
									Oath.invokers.or_else(() => {
										// TODO: Handle errors
										on_state_change("get-remote-complete")
									}),
								)

							return
						}

						// TODO: Patch changes
						token_option.cata({
							Some: token =>
								void Oath.Resolve(local_repo.get())
									.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
									.pipe(Oath.ops.tap(() => on_state_change("put-remote")))
									.pipe(Oath.ops.chain(metadata => remote_repo.put(token, metadata)))
									.invoke(
										Oath.invokers.or_else(() => {
											// TODO: Handle errors
											on_state_change("put-remote-complete")
										}),
									),
							None: noop,
						})
					}),
				)
				.subscribe(),
	}),
}
