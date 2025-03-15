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
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { type TInlineNodeParams, type TRTECodeNode, type TRTETextNode } from "../rte.types"
import { RTE } from "../rte"

export const Inline = ({ block_index, inline_index, metadata, node }: TInlineNodeParams<TRTETextNode | TRTECodeNode>) =>
	Switch.Match(node.type)
		.case("code", () => StyledCode(() => () => node.value))
		.case("text", () =>
			StyledText(({ element, use }) => {
				const fsid = metadata.get_fsid()
				const commands = use(MaokaOrdo.Jabs.get_commands)
				const is_darwin = use(MaokaJabs.is_darwin)

				use(MaokaJabs.set_attribute("data-block_index", String(block_index)))
				use(MaokaJabs.set_attribute("data-inline_index", String(inline_index)))
				use(MaokaJabs.set_attribute("contenteditable", "true"))
				use(MaokaJabs.listen("onkeydown", event => handle_keydown(event)))
				use(MaokaJabs.listen("oninput", event => handle_input(event)))
				use(MaokaJabs.listen("onclick", event => handle_click(event)))
				use(RTE.Jabs.listen_for_selection_change(fsid, block_index, inline_index))

				const styles = (node as TRTETextNode).styles ?? []

				if (styles.includes(RTE.Constants.TextNodeStyle.BOLD)) use(MaokaJabs.add_class("text-bold"))
				if (styles.includes(RTE.Constants.TextNodeStyle.ITALIC)) use(MaokaJabs.add_class("italic"))
				if (styles.includes(RTE.Constants.TextNodeStyle.STRIKETHROUGH)) use(MaokaJabs.add_class("line-through"))
				if (styles.includes(RTE.Constants.TextNodeStyle.UNDERLINE)) use(MaokaJabs.add_class("underline"))

				const handle_click = (event: MouseEvent) => {
					const selection = window.getSelection()

					if (selection) {
						event.stopPropagation()

						RTE.$.update("focus", () => fsid)

						RTE.$.update(`state.${fsid}`, state => {
							const state_copy = { ...state }
							state_copy.selection = {
								anchor: selection.anchorOffset,
								block: block_index,
								focus: selection.focusOffset,
								inline: inline_index,
							}

							return state_copy
						})
					}
				}

				const handle_input = (event: Event) =>
					RTE.$.update(`state.${fsid}`, state => {
						const state_copy = { ...state }

						const current_block = state_copy.content[block_index]

						if (RTE.Guards.is_rte_parent(current_block)) {
							const current_node = { ...current_block.children[inline_index] }

							if (RTE.Guards.is_rte_text_node(current_node)) {
								const current_node_copy = { ...current_node }
								const target = event.target as HTMLElement
								current_node_copy.value = target.innerText
								current_block.children[inline_index] = current_node_copy

								const selection = window.getSelection()

								if (selection) {
									state_copy.selection = {
										anchor: selection.anchorOffset,
										block: block_index,
										focus: selection.focusOffset,
										inline: inline_index,
									}
								}

								return state_copy
							}
						}

						return state
					})

				const handle_keydown = (event: KeyboardEvent) =>
					Switch.Match(event.code)
						.case("Enter", () => {
							event.preventDefault()
							commands.emit("cmd.rte.add_block", { block: RTE.Utils.create_paragraph(), block_index: block_index + 1, fsid })
						})
						.case("ArrowUp", () => {
							if (block_index !== 0) {
								event.preventDefault()

								RTE.$.update(`state.${fsid}`, state => {
									const state_copy = { ...state }

									const prev_block = state_copy.content[block_index - 1]

									if (!RTE.Guards.is_rte_parent(prev_block)) return state

									const last_index = prev_block.children.length - 1
									const last_inline = prev_block.children[last_index]

									if (RTE.Guards.is_rte_text_node(last_inline)) {
										const offset = last_inline.value.length
										state_copy.selection = { anchor: offset, focus: offset, block: block_index - 1, inline: last_index }
									}

									// FIXME Stay in the same line since I don't want to think any deeper rn
									return state_copy
								})
							}
						})
						.case("ArrowDown", () => {
							const state = RTE.$.select(`state.${fsid}`)

							if (state && block_index < state.content.length - 1) {
								event.preventDefault()

								RTE.$.update(`state.${fsid}`, state => {
									const state_copy = { ...state }

									const prev_block = state_copy.content[block_index + 1]

									if (!RTE.Guards.is_rte_parent(prev_block)) return state

									const last_index = prev_block.children.length - 1
									const last_inline = prev_block.children[last_index]

									if (RTE.Guards.is_rte_text_node(last_inline)) {
										const offset = last_inline.value.length
										state_copy.selection = { anchor: offset, focus: offset, block: block_index + 1, inline: last_index }
									}

									// FIXME Stay in the same line since I don't want to think any deeper rn
									return state_copy
								})
							}
						})
						.case("Backspace", () => {
							const selection = window.getSelection()
							if (selection && selection.focusOffset === 0 && selection.anchorOffset === 0) {
								event.preventDefault()

								if (block_index === 0 && inline_index === 0) return

								const state = RTE.$.select(`state.${fsid}`)

								const block = state.content[block_index]

								if (RTE.Guards.is_rte_parent(block)) {
									const inline = block.children[inline_index]

									if (RTE.Guards.is_rte_text_node(inline) && inline.value.length === 0) {
										if (inline_index === 0) commands.emit("cmd.rte.remove_block", { block_index, fsid })
										else commands.emit("cmd.rte.remove_inline", { fsid, block_index, inline_index })
									}

									// TODO Move content to previous block
									return
								}
							}
						})
						.case("Slash", () => {
							const should_call_menu = is_darwin ? event.metaKey : event.ctrlKey

							if (should_call_menu && MaokaDOM.is_maoka_dom_element(element)) {
								event.preventDefault()
								commands.emit("cmd.rte.show_quick_menu")
							}
						})
						.default(noop)

				return () => node.value
			}),
		)
		.default(() => "UNSUPPORTED NODE") // TODO Visuals for unsupported nodes

// --- Internal ---

const StyledText = MaokaStyled.Tags.span("inline-block outline-none px-1 selection:bg-pink-400/50 selection:dark:bg-pink-800")
const StyledCode = MaokaStyled.Tags.code("inline-block")
