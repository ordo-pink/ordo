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

import { is_0, noop } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

import { type TOrdoRichTextEditorInlineNode } from "../rich-text.types"
import { editor_context_jab } from "../jabs/editor-context.jab"
import { get_window_selection_offsets } from "../utils/selection.utils"

export const Inline = (
	node: TOrdoRichTextEditorInlineNode,
	metadata: Ordo.Metadata.Instance,
	block_index: number,
	inline_index: number,
) =>
	Switch.Match(node.type).default(() =>
		Maoka.create("div", ({ use, element, after_mount, on_unmount }) => {
			use(MaokaJabs.set_class("outline-none inline-block"))
			use(MaokaJabs.set_attribute("contenteditable", "true"))

			const fsid = metadata.get_fsid()
			const content_type = metadata.get_type()

			const commands = use(MaokaOrdo.Jabs.get_commands)
			const { caret_position$, state$, add_new_line, set_caret_position, remove_block } = use(editor_context_jab)

			after_mount(() => {
				const current_position = caret_position$.getValue()

				if (current_position.block_index === block_index && current_position.inline_index === inline_index) {
					const el = element as unknown as HTMLInputElement
					// set_position({ block_index, inline_index, anchor_offset: 0, focus_offset: 0 })
					// el.focus()

					const selection = window.getSelection()
					const range = document.createRange()

					if (!selection) return

					if (!el.childNodes[0]) return el.focus()

					range.setStart(el.childNodes[0], current_position.anchor_offset)

					selection.removeAllRanges()
					selection.addRange(range)
				}
			})

			use(
				MaokaJabs.listen("onmouseup", event => {
					event.stopPropagation()

					const selection = window.getSelection()

					const anchor_offset = selection?.anchorOffset ?? 0
					const focus_offset = selection?.focusOffset ?? 0

					set_caret_position({ block_index, inline_index, anchor_offset, focus_offset })
				}),
			)

			const handle_keydown = (event: KeyboardEvent) => {
				if (document.activeElement !== element) return

				Switch.Match(event.key)
					.case("Enter", () => {
						event.preventDefault()
						event.stopPropagation()

						add_new_line()
					})
					.case("Backspace", () => {
						const { anchor_offset, focus_offset } = caret_position$.getValue()

						const is_first_block = is_0(block_index)
						const is_first_inline = is_0(inline_index)
						const is_selection_start = is_0(anchor_offset)

						// Skip since `oninput` will take care of removing the selection
						if (anchor_offset !== focus_offset) return

						if (is_first_inline) {
							// We don't need to do anything here since it's either the beginning
							// of the line and it can't be backspaced, or there are characters
							// that `oninput` will take care of
							if (is_first_block) return

							if (is_selection_start) {
								event.preventDefault()
								event.stopPropagation()

								let refocus = true

								if (node.value.length > 0) {
									const state = state$.getValue()

									if (inline_index > 0) {
										state[block_index].children[inline_index - 1].value += node.value
									} else {
										const prev_block_last_inline_index = state[block_index - 1].children.length - 1
										state[block_index - 1].children[prev_block_last_inline_index].value += node.value

										refocus = false
									}

									state[block_index].children[inline_index].value = ""
									state$.next(state)
								}

								// Safely remove the block since it does not contain any content
								if (node.value.length === 0) return remove_block(block_index, refocus)
							}
						}

						// Skip since `oninput` will take care of removing the character(s)
						if (!is_selection_start) return

						// TODO Remove inline
					})
					.default(noop)
			}

			const handle_keyup = (event: KeyboardEvent) => {
				if (document.activeElement !== element) return

				Switch.Match(event.key)
					.case(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], () => {
						const { anchor_offset, focus_offset } = get_window_selection_offsets()

						set_caret_position({ block_index, inline_index, anchor_offset, focus_offset })
					})
					.default(noop)
			}

			document.addEventListener("keydown", handle_keydown)
			document.addEventListener("keyup", handle_keyup)

			on_unmount(() => {
				document.removeEventListener("keydown", handle_keydown)
				document.removeEventListener("keyup", handle_keyup)
			})

			use(
				MaokaJabs.listen("oninput", event => {
					const state = state$.getValue()
					const target = event.target as HTMLDivElement

					const { anchor_offset, focus_offset } = get_window_selection_offsets()

					set_caret_position({ block_index, inline_index, anchor_offset, focus_offset })

					state[block_index].children[inline_index].value = target.innerText
					state$.next(state)

					commands.emit("cmd.content.set", { fsid, content_type, content: JSON.stringify(state) })
				}),
			)

			return () => node.value
		}),
	)
