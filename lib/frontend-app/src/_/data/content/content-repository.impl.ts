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

import { METADATA_CONTENT_FSID } from "@ordo-pink/_core"
import { T } from "@ordo-pink/_tau"
import { create } from "@ordo-pink/oss-zags"
import { oath } from "@ordo-pink/oss-oath"

// TODO !!! Sync storages
export const ContentRepository: Ordo.Content.RepositoryStatic = {
	Of: (auth$, local_strategy, remote_strategy) => {
		const $ = create({ version: 0 })

		const divorce = auth$.marry(({ user }) => {
			// Quit from syncing with remote since the user is not authenticated
			if (!user) return

			// Check if remote state and current state are equal
			void oath
				.merge({
					remote: remote_strategy
						.get(user.get_uid(), METADATA_CONTENT_FSID)
						.pipe(oath.ops.and(oath.from_nullable))
						.pipe(oath.ops.and(stream => new Response(stream as ReadableStream).arrayBuffer()))
						.pipe(oath.ops.and(x => new TextDecoder().decode(x)))
						.pipe(oath.ops.and(x => oath.try_catch(() => JSON.parse(x) as Ordo.Metadata.DTO[])))
						.pipe(oath.ops.fix(() => [])),
					local: local_strategy
						.get(user.get_uid(), METADATA_CONTENT_FSID)
						.pipe(oath.ops.and(oath.from_nullable))
						.pipe(oath.ops.and(content => new Response(content as ReadableStream).arrayBuffer()))
						.pipe(oath.ops.and(x => new TextDecoder().decode(x)))
						.pipe(oath.ops.and(content => oath.try_catch(() => JSON.parse(content) as Ordo.Metadata.DTO[])))
						.pipe(oath.ops.fix(() => [])),
				})
				// Filter out unchanged items to avoid redundant pending updates
				.pipe(
					oath.ops.and(({ remote, local }) => ({
						remote_sorted: remote.toSorted((a, b) => (a.updated_at < b.updated_at ? -1 : a.updated_at > b.updated_at ? 1 : 0)),
						local_sorted: local.toSorted((a, b) => (a.updated_at < b.updated_at ? -1 : a.updated_at > b.updated_at ? 1 : 0)),
					})),
				)
				// Collect diffs
				.pipe(
					oath.ops.and(({ remote_sorted, local_sorted }) => {
						const local_update = [] as Ordo.Metadata.DTO[]
						const remote_update = [] as Ordo.Metadata.DTO[]
						const intersection = [] as Ordo.Metadata.DTO[]

						if (local_sorted.length === 0 && remote_sorted.length > 0) {
							local_update.push(...remote_sorted)
						} else if (local_sorted.length > 0 && remote_sorted.length === 0) {
							remote_update.push(...local_sorted)
						} else {
							let li = 0
							let ri = 0

							while (li < local_sorted.length && ri < remote_sorted.length) {
								const current_local_item = local_sorted[li]
								const current_remote_item = remote_sorted[ri]
								const remote_item = remote_sorted.find(i => i.fsid === current_local_item.fsid)
								const local_item = local_sorted.find(i => i.fsid === current_remote_item.fsid)

								if (!remote_item || current_local_item.updated_at > remote_item.updated_at) {
									remote_update.push(current_local_item)
									li++
								} else if (!local_item || current_remote_item.updated_at > local_item.updated_at) {
									local_update.push(current_remote_item)
									ri++
								} else {
									intersection.push(current_local_item)
									li++
									ri++
								}
							}
						}

						return { intersection, local_update, remote_update }
					}),
				)

				.pipe(
					oath.ops.and(({ intersection, local_update, remote_update }) => {
						oath
							.all(
								local_update.map(metadata =>
									remote_strategy
										.get(metadata.created_by ?? user.get_uid(), metadata.fsid)
										.pipe(oath.ops.and(content => new Response(content as ReadableStream).arrayBuffer()))
										.pipe(
											oath.ops.and(content =>
												local_strategy.put(metadata.created_by ?? user.get_uid(), metadata.fsid, content),
											),
										),
								),
							)
							.cata(oath.catas.unwrap())

						oath
							.all(
								remote_update.map(metadata =>
									local_strategy
										.get(metadata.created_by ?? user.get_uid(), metadata.fsid)
										.pipe(
											oath.ops.and(content =>
												remote_strategy.put(metadata.created_by ?? user.get_uid(), metadata.fsid, content),
											),
										),
								),
							)
							.cata(oath.catas.unwrap())

						return { intersection, local_update, remote_update }
					}),
				)

				.pipe(
					oath.ops.and(({ intersection, local_update, remote_update }) => ({
						local:
							local_update.length > 0 &&
							intersection
								.concat(remote_update.filter(remote_item => !local_update.some(i => i.fsid === remote_item.fsid)))
								.concat(local_update),
						remote:
							remote_update.length > 0 &&
							intersection
								.concat(local_update.filter(local_item => !remote_update.some(i => i.fsid === local_item.fsid)))
								.concat(remote_update),
					})),
				)
				.pipe(
					oath.ops.and(({ local, remote }) =>
						oath.merge({
							local:
								local &&
								local_strategy
									.put(user.get_uid(), METADATA_CONTENT_FSID, new TextEncoder().encode(JSON.stringify(local)).buffer)
									.pipe(oath.ops.and(T)),
							remote:
								remote &&
								remote_strategy
									.put(user.get_uid(), METADATA_CONTENT_FSID, new TextEncoder().encode(JSON.stringify(remote)).buffer)
									.pipe(oath.ops.and(T)),
						}),
					),
				)
				// Force update of the components due to the changes in the local repo
				.pipe(
					oath.ops.and(({ local }) =>
						oath
							.if(local)
							.pipe(oath.ops.tap(() => $.update("version", v => v + 1)))
							.pipe(oath.ops.fix(() => void 0)),
					),
				)

				.cata(oath.catas.unwrap())

			divorce()
		})

		return {
			get: (uid, fsid) => local_strategy.get(uid as Ordo.User.UID, fsid).pipe(oath.ops.fix(() => null)),
			get_all: () => local_strategy.list(),
			put: (uid, fsid, content) =>
				local_strategy
					.put(uid as Ordo.User.UID, fsid, content)
					.pipe(oath.ops.and(() => (uid ? remote_strategy.put(uid, fsid, content) : void 0))),
			remove: (uid, fsid) =>
				local_strategy
					.delete(uid as Ordo.User.UID, fsid)
					.pipe(oath.ops.and(() => (uid ? remote_strategy.delete(uid, fsid) : void 0))),
			get $() {
				return $
			},
		}
	},
}
