// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// import { is_array, is_object, is_string } from "@ordo-pink/tau"
import { BehaviorSubject } from "rxjs"

import { is_array, is_string } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"

import { type TEditorFocusPosition, type TEditorState } from "../rich-text.types"
import { editor_context, editor_context_jab } from "../jabs/editor-context.jab"
import { Line } from "./line.component"

export const RichText = (
	metadata: Ordo.Metadata.Instance,
	content: Ordo.Content.Instance,
	ctx: Ordo.CreateFunction.Params,
) => {
	const caret_position$ = new BehaviorSubject<TEditorFocusPosition>({
		block_index: 0,
		inline_index: 0,
		anchor_offset: 0,
		focus_offset: 0,
	})

	const state$ = new BehaviorSubject<TEditorState>([
		{ type: "p", children: [{ type: "text", value: "" }] },
	])

	return Maoka.create("div", ({ use, refresh }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("p-2 size-full outline-none cursor-text"))
		use(MaokaJabs.set_attribute("contenteditable", "true"))

		use(
			editor_context.provide({
				caret_position$,
				state$,
				set_caret_position: position => {
					caret_position$.next(position)
				},
				// TODO Remove block
				// TODO Remove inline
				add_block: (block, refocus = true) => {
					const { caret_position$, set_caret_position } = use(editor_context.consume)
					const caret_position = caret_position$.getValue()
					const state = state$.getValue()

					const { block_index, inline_index, anchor_offset, focus_offset } = caret_position

					// TODO Move chars from previous line

					const content = state[block_index]?.children[inline_index]

					if (content) {
						if (anchor_offset < content.value.length && focus_offset < content.value.length) {
							const closest = anchor_offset > focus_offset ? focus_offset : anchor_offset
							const furthest = anchor_offset < focus_offset ? focus_offset : anchor_offset

							block.children[0].value = content.value.slice(furthest)
							content.value = content.value.slice(0, closest)
						}
					}

					state.splice(block_index + 1, 0, block)

					state$.next(state)

					if (refocus)
						set_caret_position({
							block_index: block_index + 1,
							inline_index: 0,
							anchor_offset: 0,
							focus_offset: 0,
						})

					console.log(caret_position$.getValue())

					void refresh()
				},
				add_new_line: (refocus = true) => {
					const { add_block } = use(editor_context.consume)

					add_block({ type: "p", children: [{ type: "text", value: "" }] }, refocus)
				},
				add_inline: inline => {
					const { caret_position$: caret_position$ } = use(editor_context.consume)
					const { block_index } = caret_position$.getValue()
					const state = state$.getValue()

					state[block_index].children.splice(block_index, 0, inline)

					state$.next(state)
				},
				remove_block: (block_index, refocus = true) => {
					const state = state$.getValue()

					const prev_line_last_inline_index = state[block_index - 1].children.length - 1
					const prev_line_offset =
						state[block_index - 1].children[prev_line_last_inline_index].value.length

					// If we drop the first element and there is only one element, put
					// a paragraph instead
					if (block_index === 0) {
						// Set focus to next to preserve caret position on the same line
						refocus = true

						if (state.length === 1) {
							state[0] = { type: "p", children: [{ type: "text", value: "" }] }
						}
					} else {
						state.splice(block_index, 1)
					}

					if (refocus === true) {
						const { set_caret_position } = use(editor_context_jab)

						const state = state$.getValue()
						const new_block_index = block_index - 1
						const inline_index = state[new_block_index].children.length - 1
						const offset = state[new_block_index].children[inline_index].value.length

						set_caret_position({
							block_index: new_block_index,
							inline_index,
							anchor_offset: offset,
							focus_offset: offset,
						})
					} else {
						const { set_caret_position } = use(editor_context_jab)

						const new_block_index = block_index - 1

						set_caret_position({
							block_index: new_block_index,
							inline_index: prev_line_last_inline_index,
							anchor_offset: prev_line_offset,
							focus_offset: prev_line_offset,
						})
					}

					state$.next(state)
					void refresh()
				},
			}),
		)

		R.FromNullable(content)
			.pipe(R.ops.chain(x => R.If(is_string(x), { T: () => x as string })))
			.pipe(R.ops.chain(json => R.Try(() => JSON.parse(json))))
			.pipe(R.ops.chain(x => R.If(is_array(x) && x.length > 0, { T: () => x })))
			.cata({
				Ok: state => state$.next(state as TEditorState),
				Err: () => state$.next([{ type: "p", children: [{ type: "text", value: "" }] }]),
			})

		return () => {
			const state = state$.getValue()

			return [...state.map((node, block_index) => Line(node, metadata, block_index))]
		}
	})
}
