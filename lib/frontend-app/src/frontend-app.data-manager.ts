/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { Metadata } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"

// TODO Think at least a bit!
const METADATA_CONTENT_FSID = "b68678af-6776-47c0-a0b8-4b6535664b8c"

export const DataManager = {
	Of: (metadata_repository: Ordo.Metadata.Repository, content_repository: Ordo.Content.Repository): TMetadataManager => {
		const get_metadata_content0 = content_repository
			.get(METADATA_CONTENT_FSID, "text")
			.and(Oath.FromNullable)
			.and(content => Oath.Try(() => JSON.parse(content) as Ordo.Metadata.DTO[]))
			.fix(() => [] as Ordo.Metadata.DTO[])
			.and(dtos => dtos.map(Metadata.FromDTO))
			.and(metadata_repository.put)
			.and(result => result.cata({ Ok: () => Oath.Resolve(void 0), Err: Oath.Reject }))

		let divorce_metadata_repository: () => void
		let cancel_get_content: () => void

		return {
			start: on_state_change => {
				const mark_get_complete = () => on_state_change("get-remote-complete")
				const mark_put_complete = () => on_state_change("put-remote-complete")

				let previous_save_attempt0: Oath<void, Error>

				divorce_metadata_repository = metadata_repository.$.marry(({ version }) => {
					// Version 0 means the metadata was not yet initialized
					// Version 1 means the metadata was just initialized from remote so there are no updates to persist
					if (version < 1) return

					if (previous_save_attempt0) {
						on_state_change("put-remote-complete")
						previous_save_attempt0.cancel()
					}

					const dtos = metadata_repository
						.get()
						.pipe(Result.ops.map(metadata => metadata.map(item => item.to_dto())))
						.cata(Result.catas.or_else(() => null))

					if (!dtos) return // TODO Log error, do stuff

					previous_save_attempt0 = Oath.Resolve(on_state_change("put-remote"))
						.and(() => Oath.Try(() => JSON.stringify(dtos)))
						.and(str => content_repository.put(METADATA_CONTENT_FSID, str))

					void previous_save_attempt0
						.pipe(ops0.bitap(mark_put_complete, mark_put_complete))
						.invoke(invokers0.or_else(console.error)) // TODO handling persistence errors
				})

				cancel_get_content = () => {
					mark_get_complete()
					get_metadata_content0.cancel()
				}

				return Oath.Resolve(on_state_change("get-remote"))
					.and(() => get_metadata_content0)
					.pipe(ops0.bitap(mark_get_complete, mark_get_complete))
					.invoke(invokers0.or_else(console.error)) // TODO handling persistence errors
			},
			cancel: () => {
				if (divorce_metadata_repository) divorce_metadata_repository()
				if (cancel_get_content) cancel_get_content()
			},
		}
	},
}

export type TMetadataManagerStateChange = "get-remote" | "get-remote-complete" | "put-remote" | "put-remote-complete"

export type TMetadataManager = {
	start: (on_state_change: (change: TMetadataManagerStateChange) => void) => Promise<void>
	cancel: () => void
}

// export const MetadataManager: TMetadataManagerStatic = {
// 	of: (l_repo, r_repo /*, auth$ */) => ({
// 		start: on_state_change => {
// 			void Oath.Resolve("")
// 				.pipe(ops0.tap(() => on_state_change("get-remote")))
// 				.pipe(ops0.chain(r_repo.get))
// 				.pipe(ops0.tap(() => on_state_change("get-remote-complete")))
// 				.pipe(ops0.map(metadata => metadata.map(item => Metadata.FromDTO(item))))
// 				.pipe(ops0.map(metadata => l_repo.put(metadata)))
// 				.pipe(ops0.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
// 				.invoke(
// 					invokers0.or_else(() => {
// 						// TODO: Handle errors
// 						on_state_change("get-remote-complete")
// 					}),
// 				)
// 			// TODO: Cache/offline repo

// 			l_repo.$.subscribe(i => {
// 				if (i < 1) return

// 				void Oath.Resolve(l_repo.get())
// 					.pipe(ops0.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
// 					.pipe(ops0.map(metadata => metadata.map(item => item.to_dto())))
// 					.pipe(ops0.tap(() => on_state_change("put-remote")))
// 					.pipe(ops0.chain(metadata => r_repo.put("", metadata)))
// 					.pipe(ops0.tap(() => on_state_change("put-remote-complete")))
// 					.invoke(
// 						invokers0.or_else(() => {
// 							// TODO: Handle errors
// 							on_state_change("put-remote-complete")
// 						}),
// 					)
// 			})
// 		},
// 	}),
// 		auth$
// 			.pipe(map(auth_option => O.FromNullable(auth_option.unwrap()?.token)))
// 			.pipe(combineLatestWith(l_repo.$))
// 			.pipe(
// 				map(([token_option, iteration]) => {
// 					if (iteration === 0) {
// 						void Oath.FromNullable(token_option.unwrap())
// 							.pipe(ops0.tap(() => on_state_change("get-remote")))
// 							.pipe(ops0.chain(r_repo.get))
// 							.pipe(ops0.tap(() => on_state_change("get-remote-complete")))
// 							.pipe(ops0.map(metadata => metadata.map(item => Metadata.FromDTO(item))))
// 							.pipe(ops0.map(metadata => l_repo.put(metadata)))
// 							.pipe(ops0.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
// 							.invoke(
// 								invokers0.or_else(() => {
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
// 								.pipe(ops0.chain(res => res.cata({ Ok: Oath.Resolve, Err: Oath.Reject })))
// 								.pipe(ops0.map(metadata => metadata.map(item => item.to_dto())))
// 								.pipe(ops0.tap(() => on_state_change("put-remote")))
// 								.pipe(ops0.chain(metadata => r_repo.put(token, metadata)))
// 								.pipe(ops0.tap(() => on_state_change("put-remote-complete")))
// 								.invoke(
// 									invokers0.or_else(() => {
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
// }
