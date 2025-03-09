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

import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { type TOrdoRTECodeNode, type TOrdoRTETextNode } from "../../rich-text.types"
import { RTE } from ".."

export const Inline = (node: TOrdoRTETextNode | TOrdoRTECodeNode, block_index: number, inline_index: number) =>
	Switch.Match(node.type)
		.case("code", () => StyledCode(() => () => node.value))
		.case("text", () =>
			StyledText(({ use }) => {
				const commands = use(MaokaOrdo.Jabs.get_commands)

				use(MaokaJabs.set_attribute("data-block_index", String(block_index)))
				use(MaokaJabs.set_attribute("data-inline_index", String(inline_index)))
				use(MaokaJabs.set_attribute("contenteditable", "true"))
				use(MaokaJabs.listen("onkeydown", event => handle_keydown(event)))
				use(MaokaJabs.listen("oninput", event => handle_input(event)))
				use(RTE.Jabs.listen_for_selection_change(block_index, inline_index))

				const styles = (node as TOrdoRTETextNode).styles

				if (styles.includes(RTE.Constants.TextNodeStyles.BOLD)) use(MaokaJabs.add_class("text-bold"))
				if (styles.includes(RTE.Constants.TextNodeStyles.ITALIC)) use(MaokaJabs.add_class("italic"))
				if (styles.includes(RTE.Constants.TextNodeStyles.STRIKETHROUGH)) use(MaokaJabs.add_class("line-through"))
				if (styles.includes(RTE.Constants.TextNodeStyles.UNDERLINE)) use(MaokaJabs.add_class("underline"))

				const handle_input = (event: Event) =>
					RTE.$.update("content", content => {
						const content_copy = [...content]
						const current_block = content_copy[block_index]

						if (RTE.Guards.is_ordo_rte_parent(current_block)) {
							const current_node = { ...current_block.children[inline_index] }

							if (RTE.Guards.is_ordo_rte_text_node(current_node)) {
								const current_node_copy = { ...current_node }
								const target = event.target as HTMLElement
								current_node_copy.value = target.innerText
								current_block.children[inline_index] = current_node_copy
							}
						}

						return content_copy
					})

				const handle_keydown = (event: KeyboardEvent) =>
					Switch.Match(event.code)
						.case("Enter", () => {
							event.preventDefault()
							commands.emit("cmd.rich_text.add_block", { block: RTE.Utils.create_paragraph(), block_index: block_index + 1 })
						})
						.case("ArrowUp", () => {
							if (block_index !== 0) {
								event.preventDefault()

								RTE.$.update("selection", s => {
									const content = RTE.$.select("content")

									const prev_block = content[block_index - 1]

									if (!RTE.Guards.is_ordo_rte_parent(prev_block)) return s

									const last_index = prev_block.children.length - 1
									const last_inline = prev_block.children[last_index]

									if (RTE.Guards.is_ordo_rte_text_node(last_inline)) {
										const offset = last_inline.value.length
										return { anchor: offset, focus: offset, block: block_index - 1, inline: last_index }
									}

									// FIXME Stay in the same line since I don't want to think any deeper rn
									return s
								})
							}
						})
						.case("ArrowDown", () => {
							const content = RTE.$.select("content")

							if (block_index < content.length - 1) {
								event.preventDefault()

								RTE.$.update("selection", s => {
									const prev_block = content[block_index + 1]

									if (!RTE.Guards.is_ordo_rte_parent(prev_block)) return s

									const last_index = prev_block.children.length - 1
									const last_inline = prev_block.children[last_index]

									if (RTE.Guards.is_ordo_rte_text_node(last_inline)) {
										const offset = last_inline.value.length
										return { anchor: offset, focus: offset, block: block_index + 1, inline: last_index }
									}

									// FIXME Stay in the same line since I don't want to think any deeper rn
									return s
								})
							}
						})
						.case("Backspace", () => {
							const selection = window.getSelection()
							if (selection && selection.focusOffset === 0 && selection.anchorOffset === 0) {
								event.preventDefault()

								if (block_index === 0 && inline_index === 0) return

								const content = RTE.$.select("content")

								const block = content[block_index]

								if (RTE.Guards.is_ordo_rte_parent(block)) {
									const inline = block.children[inline_index]

									if (RTE.Guards.is_ordo_rte_text_node(inline) && inline.value.length === 0) {
										if (inline_index === 0) commands.emit("cmd.rich_text.remove_block", block_index)
										else commands.emit("cmd.rich_text.remove_inline", { block_index, inline_index })
									}

									// TODO Move content to previous block
									return
								}
							}
						})
						.default(noop)

				return () => node.value
			}),
		)
		.default(() => "UNSUPPORTED NODE") // TODO Visuals for unsupported nodes

// --- Internal ---

const StyledText = MaokaStyled.Tags.span("inline-block outline-none px-1")
const StyledCode = MaokaStyled.Tags.code("inline-block")
