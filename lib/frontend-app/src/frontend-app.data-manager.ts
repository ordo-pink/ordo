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
import { is_date, keys_of } from "@ordo-pink/tau"
import { METADATA_CONTENT_FSID } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"

import { Metadata } from "../../core/src/metadata.impl"
import { ordo_app_state } from "../app.state"

export const DataManager = {
	Of: (metadata_repository: Ordo.Metadata.Repository, content_repository: Ordo.Content.Repository): TMetadataManager => {
		const dt_host = ordo_app_state.zags.select("hosts.dt")

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
					.and(() => {
						const last_local = metadata_repository
							.get()
							.pipe(
								Result.ops.map(items =>
									items.reduce(
										(acc, v) => (acc ? (v.get_updated_at() > acc ? v.get_updated_at() : acc) : v.get_updated_at()),
										null as Date | null,
									),
								),
							)
							.pipe(Result.ops.chain(Result.FromNullable))
							.cata(Result.catas.or_else(() => new Date(1970, 1, 2)))

						const fetch = ordo_app_state.zags.select("fetch")
						const token = ordo_app_state.zags.select("auth.token")
						const user = ordo_app_state.zags.select("auth.user")

						if (!user || !token) return

						void Oath.Try(() =>
							fetch(`${dt_host}/${user?.get_id()}/${METADATA_CONTENT_FSID}`, {
								headers: { Authorization: `Bearer ${token}` },
								method: "HEAD",
							}),
						)
							.and(res => Oath.FromNullable(res.headers.get("last-modified")))
							.and(str => new Date(str))
							.and(Oath.FromNullable)
							.and(date => Oath.If(is_date(date)))
							.fix(() => new Date(1970, 1, 1))
							.and(last_remote => {
								if (last_remote! < last_local) {
									// TODO Put all content
									return content_repository.get_all().and(items =>
										Oath.Merge(
											keys_of(items).map(key =>
												Oath.Try(() =>
													fetch(`${dt_host}/${user.get_id()}/${key}`, {
														method: "PUT",
														headers: { Authorization: `Bearer ${token}` },
														body: items[key],
													}),
												),
											),
										),
									)
								} else if (last_remote! > last_local) {
									// TODO Pull all content
								}
							})
							.invoke(invokers0.force_resolve)
					})
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
