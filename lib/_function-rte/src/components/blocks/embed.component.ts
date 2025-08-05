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

import { Button, MetadataIcon, MetadataLink } from "@ordo-pink/maoka-components"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/oss-result"
import { oath } from "@ordo-pink/oss-oath"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { type TBlockNodeParams, type TRTEEmbedNode } from "../../rte.types"
import { RTE } from "../../rte"

export const Embed = ({ node, block_index, metadata, is_editable, is_embedded }: TBlockNodeParams<TRTEEmbedNode>) =>
	is_embedded
		? void 0
		: StyledEmbed(({ refresh }) => {
				return () =>
					node.fsid
						? StyledEmbedWithFSID(({ use }) => {
								const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(node.fsid))

								const content_query = use(MaokaOrdo.Jabs.get_content_query)
								const content0 = content_query.get("" as any, node.fsid!)

								// TODO Unsupported file component
								return async () => {
									const metadata = get_metadata()
									const content = await content0.cata(oath.catas.or_else(() => null))
									const fas = ordo_app_state.zags.select("functions.file_assocs")
									const fa = fas.find(fa => fa.types.some(t => t.name === get_metadata()?.get_type())) ?? null

									if (!metadata || !fa || !fa.render) return [] as any // TODO Improve type definition for TMaokaChildren

									return [
										StyledEmbedTitleWrapper(() => () => MetadataLink({ metadata, children: metadata.get_name() })),
										fa.render({ metadata, content, is_editable, is_embedded: true }),
									]
								}
							})
						: StyledNoFSIDEmbed(({ use }) => {
								const fsid = metadata.get_fsid()

								const commands = use(MaokaOrdo.Jabs.get_commands)
								const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)

								const on_click = (event: MouseEvent) => {
									event.preventDefault()

									metadata_query
										.get()
										.pipe(R.ops.chain(R.FromNullable))
										.pipe(R.ops.map(metadata => metadata.filter(i => i.get_fsid() !== fsid && !i.get_links().includes(fsid))))
										.pipe(
											R.ops.map(metadata =>
												commands.emit("cmd.application.command_palette.show", {
													max_items: 100,
													on_select: item => {
														RTE.$.update(`state.${fsid}`, state => {
															if (RTE.Guards.is_rte_embed_node(state.content[block_index])) {
																const state_copy = { ...state }
																state_copy.content[block_index].fsid = item.value
																return state_copy
															}

															return state
														})

														refresh()
													},
													items: metadata.map(item => ({
														readable_name: item.get_name() as Ordo.I18N.TranslationKey,
														value: item.get_fsid(),
														render_icon: () => MetadataIcon({ metadata: item }),
													})),
												}),
											),
										)
								}

								return () => Button.Neutral({ on_click, text: "Choose a file to embed" })
							})
			})

// --- Internal ---

const StyledEmbedTitleWrapper = MaokaStyled.Tags.div("flex p-2 justify-end text-neutral-500 text-sm")
const StyledNoFSIDEmbed = MaokaStyled.Tags.div("w-full flex justify-center py-2")
const StyledEmbedWithFSID = MaokaStyled.Tags.div("")
const StyledEmbed = MaokaStyled.Tags.div("ml-2 w-full bg-neutral-200/40 dark:bg-neutral-900/20 rounded-md")
