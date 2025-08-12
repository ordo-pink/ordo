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

import { METADATA_CONTENT_FSID, Metadata, rrr } from "@ordo-pink/_core"
import { Oath, oath } from "@ordo-pink/oss-oath"
import { result } from "@ordo-pink/oss-result"
import { is_array } from "@ordo-pink/_tau"

import { ordo_app_state } from "../app.state"

// TODO Merge with content repository
export const MetadataManager = {
	Of: (metadata_repository: Ordo.Metadata.Repository, content_repository: Ordo.Content.Repository): TMetadataManager => {
		const user = ordo_app_state.zags.select("user")
		const logger = ordo_app_state.zags.select("logger")

		const get_metadata_content0 = content_repository
			.get(user?.get_uid() ?? null, METADATA_CONTENT_FSID)
			.pipe(oath.ops.and(oath.from_nullable))
			.pipe(oath.ops.and(content => new TextDecoder().decode(content as ArrayBuffer)))
			.pipe(oath.ops.and(content => oath.try(() => JSON.parse(content) as Ordo.Metadata.DTO[])))
			.pipe(oath.ops.fix(() => [] as Ordo.Metadata.DTO[]))
			.pipe(oath.ops.and(dtos => dtos.map(Metadata.FromDTO)))
			.pipe(oath.ops.and(metadata_repository.put))
			.pipe(oath.ops.and(result => result.cata({ Ok: () => oath.of(void 0), Err: oath.reject })))

		// Wait for content changes to arrive in case the state needs to be refreshed after sync with remote
		content_repository.$.marry((_, is_update) => {
			// TODO Avoid updates if metadata file was not updated
			if (!is_update) return

			const user = ordo_app_state.zags.select("user")

			void content_repository
				.get(user?.get_uid() ?? null, METADATA_CONTENT_FSID)
				.pipe(oath.ops.and(stream => new Response(stream as ArrayBuffer)))
				.pipe(oath.ops.and(res => res.json()))
				.pipe(oath.ops.and(items => oath.if(is_array(items), { t: () => items })))
				.pipe(oath.ops.and(items => items.map(Metadata.FromDTO)))
				.pipe(oath.ops.and(json => metadata_repository.put(json)))
				.cata(oath.catas.unwrap())
		})

		let divorce_metadata_repository: () => void
		let cancel_get_content: () => void

		return {
			start: on_state_change => {
				const mark_get_complete = () => on_state_change("get-remote-complete")
				const mark_put_complete = () => on_state_change("put-remote-complete")

				let previous_save_attempt0: Oath.Instance<void, Error>

				divorce_metadata_repository = metadata_repository.$.marry(({ version }) => {
					// Version 0 means the metadata was not yet initialized
					// Version 1 means the metadata was just initialized from remote so there are no updates to persist
					if (version <= 1) return

					if (previous_save_attempt0) {
						on_state_change("put-remote-complete")
						previous_save_attempt0.cancel("Save attempt prevented due to newer update")
					}

					const dtos = metadata_repository
						.get()
						.pipe(result.ops.map(metadata => metadata.map(item => item.to_dto())))
						.cata(result.catas.or_else(() => null))

					if (!dtos) return // TODO Log error, do stuff

					const user = ordo_app_state.zags.select("user")

					previous_save_attempt0 = oath
						.of(on_state_change("put-remote"))
						.pipe(
							oath.ops.and(() => {
								if (user) {
									const authenticated_dtos = dtos.map(dto => {
										if (!dto.created_by) dto.created_by = user.get_uid()
										if (!dto.updated_by) dto.updated_by = user.get_uid()

										return dto
									})

									return authenticated_dtos
								}

								return dtos
							}),
						)
						.pipe(
							oath.ops.and(dtos =>
								oath.try(
									() => JSON.stringify(dtos),
									e => rrr.codes.eio("Failed to get content", e),
								),
							),
						)
						.pipe(
							oath.ops.and(str =>
								content_repository.put(user?.get_uid() ?? null, METADATA_CONTENT_FSID, new TextEncoder().encode(str).buffer),
							),
						) as any

					previous_save_attempt0 &&
						void previous_save_attempt0.pipe(oath.ops.tap(mark_put_complete, mark_put_complete)).cata(
							oath.catas.or_else(e => {
								if ((e as any) === "Save attempt prevented due to newer update") return
								logger.error(e)
							}),
						)
				})

				cancel_get_content = () => {
					mark_get_complete()
					get_metadata_content0.cancel("Save attempt prevented due to newer update")
				}

				return oath
					.of(on_state_change("get-remote"))
					.pipe(() => get_metadata_content0)
					.pipe(oath.ops.tap(mark_get_complete, mark_get_complete))
					.cata(oath.catas.or_else(console.error)) as any // TODO handling persistence errors
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
