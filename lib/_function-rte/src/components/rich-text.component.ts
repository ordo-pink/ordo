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

import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/oss-result"
import { is_array } from "@ordo-pink/_tau"

import { Block } from "./block.component"
import { RTE } from "../rte"
import { type TRTEContent } from "../rte.types"

import "../rte.css"

export const RichText = (
	metadata: Ordo.Metadata.Instance,
	content: Ordo.Content.Instance,
	is_editable: boolean,
	is_embedded: boolean,
) =>
	MaokaRichText(({ refresh, use }) => {
		let length = 0

		const fsid = metadata.get_fsid()
		const commands = use(MaokaOrdo.Jabs.get_commands)

		const handle_mount = () => {
			RTE.$.update("focus", prev => (is_embedded ? (is_editable ? fsid : prev) : fsid))

			R.FromNullable(content)
				.pipe(
					R.ops.chain(x => {
						if (x instanceof ArrayBuffer) return R.Ok(new TextDecoder().decode(x))
						return R.Err("Unexpected content type")
					}),
				)
				.pipe(R.ops.chain(x => R.Try(() => JSON.parse(x))))
				.pipe(R.ops.chain(x => R.If(is_array(x) && x.length > 0, { T: () => x })))
				.cata({
					Err: () => {
						length = 0
						RTE.$.update(`state.${fsid}`, () => ({
							content: RTE.Utils.create_content(),
							is_focused: !is_embedded,
							selection: RTE.Utils.create_selection(),
						}))
					},
					Ok: state => {
						length = state.length
						RTE.$.update(`state.${fsid}`, () => ({
							content: state as TRTEContent,
							is_focused: !is_embedded,
							selection: RTE.Utils.create_selection(),
						}))
						refresh()
					},
				})

			const divorce_state = RTE.$.cheat(`state.${fsid}`, ({ content }, is_update) => {
				if (is_update)
					commands.emit("cmd.content.set", {
						content: new TextEncoder().encode(JSON.stringify(content)).buffer,
						content_type: "text/ordo",
						fsid,
					})

				if (length !== content.length) {
					length = content.length
					refresh()
				}
			})

			return () => {
				divorce_state()
			}
		}

		use(MaokaDOM.Jabs.onmount(handle_mount))

		return () => {
			const state = RTE.$.select(`state.${fsid}`)

			if (!state) return null

			return state.content.map((_, line_index) => Block(line_index, metadata, is_editable, is_embedded))
		}
	})

// --- Internal ---

const MaokaRichText = MaokaStyled.Tags.div("p-2 size-full outline-none cursor-text")
