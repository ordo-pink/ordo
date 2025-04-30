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
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { sweech } from "@ordo-pink/sweech"
import { noop } from "@ordo-pink/tau"

import { type TInlineNodeParams, type TRTECodeNode, type TRTETextNode } from "../rte.types"
import { RTE } from "../rte"

export const Inline = ({
	block_index,
	inline_index,
	metadata,
	node,
	is_editable,
}: TInlineNodeParams<TRTETextNode | TRTECodeNode>) =>
	sweech
		.match(node.type)
		.case("code", () => StyledCode(() => () => node.value))
		.case("text", () =>
			StyledText(({ element, use }) => {
				const fsid = metadata.get_fsid()
				const commands = use(MaokaOrdo.Jabs.get_commands)
				const is_darwin = use(maoka_jabs.is_darwin)

				use(maoka_jabs.set_attribute("data-block_index", String(block_index)))
				use(maoka_jabs.set_attribute("data-inline_index", String(inline_index)))
				if (is_editable) use(maoka_jabs.set_attribute("contenteditable", "true"))
				use(maoka_jabs.listen("onkeydown", event => handle_keydown(event)))
				use(maoka_jabs.listen("oninput", event => handle_input(event)))
				use(maoka_jabs.listen("onclick", event => handle_click(event)))
				use(RTE.Jabs.listen_for_selection_change(fsid, block_index, inline_index))

				const styles = (node as TRTETextNode).styles ?? []

				if (styles.includes(RTE.Constants.TextNodeStyle.BOLD)) use(maoka_jabs.add_class("text-bold"))
				if (styles.includes(RTE.Constants.TextNodeStyle.ITALIC)) use(maoka_jabs.add_class("italic"))
				if (styles.includes(RTE.Constants.TextNodeStyle.STRIKETHROUGH)) use(maoka_jabs.add_class("line-through"))
				if (styles.includes(RTE.Constants.TextNodeStyle.UNDERLINE)) use(maoka_jabs.add_class("underline"))

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
					sweech
						.match(event.code)
						.case("Enter", () => {
							event.preventDefault()

							const selection = window.getSelection()
							const state = RTE.$.select(`state.${fsid}`)
							const block = state.content[block_index]

							if (!RTE.Guards.is_rte_parent(block)) return

							const inline = block.children[inline_index]

							if (!RTE.Guards.is_rte_text_node(inline)) return

							let next_line_value = ""

							if (selection) {
								const start = selection.anchorOffset > selection.focusOffset ? selection.focusOffset : selection.anchorOffset
								const end = selection.anchorOffset > selection.focusOffset ? selection.anchorOffset : selection.focusOffset

								next_line_value = inline.value.slice(end)

								RTE.$.update(`state.${fsid}.content`, content => {
									const content_copy = { ...content }
									;(content_copy[block_index] as any).children[inline_index].value = inline.value.slice(0, start)

									return content
								})
							}

							commands.emit("cmd.rte.add_block", {
								block: RTE.Utils.create_paragraph(next_line_value),
								block_index: block_index + 1,
								fsid,
							})
						})
						.case("ArrowLeft", () => {
							const selection = window.getSelection()

							if (block_index !== 0 && inline_index === 0 && selection && selection.focusOffset === 0) {
								RTE.$.update(`state.${fsid}`, state => {
									const state_copy = { ...state }

									const prev_block = state_copy.content[block_index - 1]

									if (RTE.Guards.is_rte_parent(prev_block)) {
										const prev_block_last_inline = prev_block.children[prev_block.children.length - 1]
										if (RTE.Guards.is_rte_text_node(prev_block_last_inline)) {
											event.preventDefault()

											state_copy.selection.block = block_index - 1
											state_copy.selection.inline = prev_block.children.length - 1
											state_copy.selection.anchor = prev_block_last_inline.value.length
											state_copy.selection.focus = prev_block_last_inline.value.length
										}
									}

									return state_copy
								})
							}
						})
						.case("ArrowRight", () => {
							const selection = window.getSelection()
							const state = RTE.$.select(`state.${fsid}`)

							if (
								selection &&
								block_index < state.content.length - 1 &&
								RTE.Guards.is_rte_parent(state.content[block_index]) &&
								inline_index === state.content[block_index].children.length - 1 &&
								RTE.Guards.is_rte_text_node(state.content[block_index].children[inline_index]) &&
								selection.focusOffset === state.content[block_index].children[inline_index].value.length
							) {
								const next_block = state.content[block_index + 1]

								if (RTE.Guards.is_rte_parent(next_block)) {
									const next_block_first_inline = next_block.children[0]
									if (RTE.Guards.is_rte_text_node(next_block_first_inline)) {
										event.preventDefault()

										RTE.$.update(`state.${fsid}`, state => {
											const state_copy = { ...state }

											state_copy.selection.block = block_index + 1
											state_copy.selection.inline = 0
											state_copy.selection.anchor = 0
											state_copy.selection.focus = 0

											return state_copy
										})
									}
								}
							}
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

									if (!RTE.Guards.is_rte_text_node(inline)) return state

									if (inline_index === 0) {
										const value = inline.value

										RTE.$.update(`state.${fsid}`, state => {
											const state_copy = { ...state }

											const prev_block = state_copy.content[block_index - 1]

											if (RTE.Guards.is_rte_parent(prev_block)) {
												const prev_block_last_inline = prev_block.children[prev_block.children.length - 1]

												if (RTE.Guards.is_rte_text_node(prev_block_last_inline)) {
													state_copy.selection.block = block_index - 1
													state_copy.selection.inline = prev_block.children.length - 1
													state_copy.selection.anchor = prev_block_last_inline.value.length
													state_copy.selection.focus = prev_block_last_inline.value.length

													prev_block_last_inline.value += value
												}
											}

											return state_copy
										})

										commands.emit("cmd.rte.remove_block", { block_index, fsid, preserve_caret_position: true })
									} else {
										// TODO Drop current inline

										commands.emit("cmd.rte.remove_block", { block_index, fsid })
									}

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
