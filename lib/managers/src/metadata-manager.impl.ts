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

// import { combineLatestWith, map } from "rxjs"

import { Metadata } from "@ordo-pink/core"
// import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
// import { noop } from "@ordo-pink/tau"

import { type TMetadataManagerStatic } from "./metadata-manager.types"

export const MetadataManager: TMetadataManagerStatic = {
	of: (l_repo, r_repo /*, auth$ */) => ({
		start: on_state_change => {
			void Oath.Resolve("")
				.pipe(Oath.ops.tap(() => on_state_change("get-remote")))
				.pipe(Oath.ops.chain(r_repo.get))
				.pipe(Oath.ops.tap(() => on_state_change("get-remote-complete")))
				.pipe(Oath.ops.map(metadata => metadata.map(item => Metadata.FromDTO(item))))
				.pipe(Oath.ops.map(metadata => l_repo.put(metadata)))
				.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
				.invoke(
					Oath.invokers.or_else(() => {
						// TODO: Handle errors
						on_state_change("get-remote-complete")
					}),
				)
			// TODO: Cache/offline repo

			l_repo.$.subscribe(i => {
				if (i < 1) return

				void Oath.Resolve(l_repo.get())
					.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
					.pipe(Oath.ops.map(metadata => metadata.map(item => item.to_dto())))
					.pipe(Oath.ops.tap(() => on_state_change("put-remote")))
					.pipe(Oath.ops.chain(metadata => r_repo.put("", metadata)))
					.pipe(Oath.ops.tap(() => on_state_change("put-remote-complete")))
					.invoke(
						Oath.invokers.or_else(() => {
							// TODO: Handle errors
							on_state_change("put-remote-complete")
						}),
					)
			})
		},
	}),
	// 		auth$
	// 			.pipe(map(auth_option => O.FromNullable(auth_option.unwrap()?.token)))
	// 			.pipe(combineLatestWith(l_repo.$))
	// 			.pipe(
	// 				map(([token_option, iteration]) => {
	// 					if (iteration === 0) {
	// 						void Oath.FromNullable(token_option.unwrap())
	// 							.pipe(Oath.ops.tap(() => on_state_change("get-remote")))
	// 							.pipe(Oath.ops.chain(r_repo.get))
	// 							.pipe(Oath.ops.tap(() => on_state_change("get-remote-complete")))
	// 							.pipe(Oath.ops.map(metadata => metadata.map(item => Metadata.FromDTO(item))))
	// 							.pipe(Oath.ops.map(metadata => l_repo.put(metadata)))
	// 							.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
	// 							.invoke(
	// 								Oath.invokers.or_else(() => {
	// 									// TODO: Handle errors
	// 									on_state_change("get-remote-complete")
	// 								}),
	// 							)

	// 						return
	// 					}

	// 					// TODO: Patch changes
	// 					token_option.cata({
	// 						Some: token =>
	// 							void Oath.Resolve(l_repo.get())
	// 								.pipe(Oath.ops.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
	// 								.pipe(Oath.ops.map(metadata => metadata.map(item => item.to_dto())))
	// 								.pipe(Oath.ops.tap(() => on_state_change("put-remote")))
	// 								.pipe(Oath.ops.chain(metadata => r_repo.put(token, metadata)))
	// 								.pipe(Oath.ops.tap(() => on_state_change("put-remote-complete")))
	// 								.invoke(
	// 									Oath.invokers.or_else(() => {
	// 										// TODO: Handle errors
	// 										on_state_change("put-remote-complete")
	// 									}),
	// 								),
	// 						None: noop,
	// 					})
	// 				}),
	// 			)
	// 			.subscribe(),
	// }),
}
