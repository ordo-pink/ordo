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

import { is_array, is_string } from "@ordo-pink/tau"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/result"

import { Line } from "./line.component"
import { RTE } from ".."
import { type TEditorContent } from "../../rich-text.types"

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

		commands.on("cmd.rich_text.add_block", handle_add_block)
		commands.on("cmd.rich_text.remove_block", handle_remove_block)

		use(
			MaokaDOM.Jabs.onunmount(() => {
				commands.off("cmd.rich_text.add_block", handle_add_block)
				commands.off("cmd.rich_text.remove_block", handle_remove_block)
			}),
		)

		RTE.$.update("is_editable", () => is_editable)
		RTE.$.update("is_embedded", () => is_embedded)

		R.FromNullable(content)
			.pipe(R.ops.chain(x => R.If(is_string(x), { T: () => x as string })))
			.pipe(R.ops.chain(x => R.Try(() => JSON.parse(x))))
			.pipe(R.ops.chain(x => R.If(is_array(x) && x.length > 0, { T: () => x })))
			.cata({
				Err: () => RTE.$.update("content", () => RTE.Utils.create_content()),
				Ok: state => RTE.$.update("content", () => state as TEditorContent),
			})

		const subscribe_to_editor_state = () => {
			const divorce_state = RTE.$.marry(({ content }, is_update) => {
				if (!is_update) {
					length = content.length
					return
				}

				commands.emit("cmd.content.set", { content: JSON.stringify(content), content_type: "text/ordo", fsid })

				if (length !== content.length) {
					length = content.length
					refresh()
				}
			})

			return () => divorce_state()
		}

		use(MaokaDOM.Jabs.onmount(subscribe_to_editor_state))

		return () => {
			const state = RTE.$.select("content")

			return state.map((_, line_index) => Line(line_index))
		}
	})

// --- Internal ---

const MaokaRichText = MaokaStyled.Tags.div("p-2 size-full outline-none cursor-text")

const handle_add_block: Ordo.Command.HandlerOf<"cmd.rich_text.add_block"> = ({ block, block_index }) => {
	RTE.$.update("content", content => content.slice(0, block_index).concat(block).concat(content.slice(block_index)))
	RTE.$.update("selection", () => ({ anchor: 0, block: block_index, focus: 0, inline: 0 }))
}

const handle_remove_block: Ordo.Command.HandlerOf<"cmd.rich_text.remove_block"> = block_index => {
	RTE.$.update("content", content => {
		return content.toSpliced(block_index, 1)
	})

	if (block_index > 0) {
		RTE.$.update("selection", selection => {
			const content = RTE.$.select("content")

			const prev_block = content[block_index - 1]

			if (!prev_block) return selection

			if (RTE.Guards.is_ordo_rte_parent(prev_block)) {
				const last_index = prev_block.children.length - 1
				const last_inline = prev_block.children[last_index]

				if (RTE.Guards.is_ordo_rte_text_node(last_inline)) {
					const offset = last_inline.value.length
					return { anchor: offset, focus: offset, block: block_index - 1, inline: last_index }
				}

				// FIXME Stay in the same line since I don't want to think any deeper rn
				return selection
			}

			return RTE.Utils.create_selection()
		})
	}
}
