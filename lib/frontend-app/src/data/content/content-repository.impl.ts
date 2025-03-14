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

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { METADATA_CONTENT_FSID } from "@ordo-pink/core"
import { T } from "@ordo-pink/tau"
import { ZAGS } from "@ordo-pink/zags"

// TODO !!! Sync storages
export const ContentRepository: Ordo.Content.RepositoryStatic = {
	Of: (auth$, local_strategy, remote_strategy) => {
		const $ = ZAGS.Of({ version: 0 })

		const divorce = auth$.marry(({ user }) => {
			// Quit from syncing with remote since the user is not authenticated
			if (!user) return

			// Check if remote state and current state are equal
			void Oath.Merge({
				remote: remote_strategy
					.get(user.get_uid(), METADATA_CONTENT_FSID)
					.and(Oath.FromNullable)
					.and(stream => new Response(stream as ReadableStream).json() as Promise<Ordo.Metadata.DTO[]>)
					.fix(() => []),
				local: local_strategy
					.get(user.get_uid(), METADATA_CONTENT_FSID)
					.and(Oath.FromNullable)
					.and(content => Oath.Try(() => JSON.parse(content as string) as Ordo.Metadata.DTO[]))
					.fix(() => []),
			})
				// Filter out unchanged items to avoid redundant pending updates
				.and(({ remote, local }) => ({
					remote_sorted: remote.toSorted((a, b) => (a.updated_at < b.updated_at ? -1 : a.updated_at > b.updated_at ? 1 : 0)),
					local_sorted: local.toSorted((a, b) => (a.updated_at < b.updated_at ? -1 : a.updated_at > b.updated_at ? 1 : 0)),
				}))
				// Collect diffs
				.and(({ remote_sorted, local_sorted }) => {
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
				})
				.and(({ intersection, local_update, remote_update }) => ({
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
				}))
				.and(({ local, remote }) =>
					Oath.Merge({
						local: local && local_strategy.put(user.get_uid(), METADATA_CONTENT_FSID, JSON.stringify(local)).and(T),
						remote: remote && remote_strategy.put(user.get_uid(), METADATA_CONTENT_FSID, JSON.stringify(remote)).and(T),
					}),
				)
				// Force update of the components due to the changes in the local repo
				.and(({ local }) =>
					Oath.If(local)
						.pipe(ops0.tap(() => $.update("version", v => v + 1)))
						.fix(() => void 0),
				)

				.invoke(invokers0.to_promise)

			divorce()
		})

		return {
			get: (uid, fsid) => local_strategy.get(uid as Ordo.User.UID, fsid).fix(() => null),
			get_all: () => local_strategy.list(),
			put: (uid, fsid, content) => local_strategy.put(uid as Ordo.User.UID, fsid, content),
			remove: (uid, fsid) =>
				local_strategy.delete(uid as Ordo.User.UID, fsid).and(() => (uid ? remote_strategy.delete(uid, fsid) : void 0)),
			get $() {
				return $
			},
		}
	},
}
