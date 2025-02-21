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

// TODO Publish file as a new file
// TODO Access file by user_handle and prop link (e.g. https://pub.ordo.pink/@ordo-blog/en/release-0.8.0)
//                                                     ^-----pub host------^ ^----user---^ ^--file_id---^

import { METADATA_CONTENT_FSID, Metadata } from "@ordo-pink/core"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { is_array, is_string } from "@ordo-pink/tau"
import { Result } from "@ordo-pink/result"

import { ordo_app_state } from "../app.state"

export const MetadataManager = {
	Of: (metadata_repository: Ordo.Metadata.Repository, content_repository: Ordo.Content.Repository): TMetadataManager => {
		const user = ordo_app_state.zags.select("auth.user")
		const logger = ordo_app_state.zags.select("logger")

		const get_metadata_content0 = content_repository
			.get(user?.get_id() ?? null, METADATA_CONTENT_FSID)
			.and(Oath.FromNullable)
			.and(content => Oath.If(is_string(content), { T: () => content as string }))
			.and(content => Oath.Try(() => JSON.parse(content) as Ordo.Metadata.DTO[]))
			.fix(() => [] as Ordo.Metadata.DTO[])
			.and(dtos => dtos.map(Metadata.FromDTO))
			.and(metadata_repository.put)
			.and(result => result.cata({ Ok: () => Oath.Resolve(void 0), Err: Oath.Reject }))

		content_repository.$.marry((_, is_update) => {
			if (!is_update) return

			const user = ordo_app_state.zags.select("auth.user")

			void content_repository
				.get(user?.get_id() ?? null, METADATA_CONTENT_FSID)
				.and(stream => new Response(stream))
				.and(res => res.json())
				.and(items => Oath.If(is_array(items), { T: () => items }))
				.and(items => items.map(Metadata.FromDTO))
				.and(json => metadata_repository.put(json))
				.invoke(invokers0.to_promise)
		})

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

					const user = ordo_app_state.zags.select("auth.user")

					previous_save_attempt0 = Oath.Resolve(on_state_change("put-remote"))
						.and(() => {
							if (user) {
								const authenticated_dtos = dtos.map(dto => {
									if (!dto.created_by) (dto as any).created_by = user.get_id()
									if (!dto.updated_by) (dto as any).updated_by = user.get_id()

									return dto
								})

								return authenticated_dtos
							}

							return dtos
						})
						.and(dtos => Oath.Try(() => JSON.stringify(dtos)))
						.and(str => content_repository.put(user?.get_id() ?? null, METADATA_CONTENT_FSID, str))

					previous_save_attempt0 &&
						void previous_save_attempt0.pipe(ops0.bitap(mark_put_complete, mark_put_complete)).invoke(
							invokers0.or_else(e => {
								if ((e as any) === "Cancelled") return
								logger.error(e)
							}),
						)
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
