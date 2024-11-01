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

import { type TEditorFocusPosition, type TEditorStructure } from "../rich-text.types"
import { Line } from "./line.component"
import { editor_context } from "../jabs/editor-context.jab"

export const RichText = (
	metadata: Ordo.Metadata.Instance,
	content: Ordo.Content.Instance,
	ctx: Ordo.CreateFunction.Params,
) => {
	const position$ = new BehaviorSubject<TEditorFocusPosition>({
		block_index: 0,
		inline_index: 0,
		anchor_offset: 0,
		focus_offset: 0,
	})

	const structure$ = new BehaviorSubject<TEditorStructure>([
		{ type: "p", children: [{ type: "text", value: "" }] },
	])

	return Maoka.create("div", ({ use, refresh }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("p-2 size-full outline-none cursor-text"))
		use(MaokaJabs.set_attribute("contenteditable", "true"))

		use(
			editor_context.provide({
				position$,
				structure$,
				set_position: position => {
					if (!position.anchor_offset || !position.focus_offset) {
						const selection = window.getSelection()

						// TODO Watch range instead
						position.anchor_offset = selection?.anchorOffset ?? 0
						position.focus_offset = selection?.focusOffset ?? 0
					}

					console.log(position)
					position$.next(position as TEditorFocusPosition)
				},
				// TODO Remove block
				// TODO Remove inline
				add_block: (block, focus = true) => {
					const { position$, set_position } = use(editor_context.consume)
					const position = position$.getValue()
					const state = structure$.getValue()

					// TODO Move chars from previous line

					const content = state[position.block_index]?.children[position.inline_index]

					if (content) {
						if (
							position.anchor_offset < content.value.length &&
							position.focus_offset < content.value.length
						) {
							const { anchor_offset, focus_offset } = position
							const closest = anchor_offset > focus_offset ? focus_offset : anchor_offset
							const furthest = anchor_offset < focus_offset ? focus_offset : anchor_offset

							block.children[0].value = content.value.slice(furthest)
							content.value = content.value.slice(0, closest)
						}
					}

					state.splice(position.block_index + 1, 0, block)

					structure$.next(state)

					if (focus)
						set_position({
							block_index: position.block_index + 1,
							inline_index: 0,
							anchor_offset: 0,
							focus_offset: 0,
						})

					void refresh()
				},
				add_new_line: (focus = true) => {
					const { add_block } = use(editor_context.consume)

					add_block({ type: "p", children: [{ type: "text", value: "" }] }, focus)
				},
				add_inline: inline => {
					const { position$ } = use(editor_context.consume)
					const position = position$.getValue()
					const state = structure$.getValue()

					state[position.block_index].children.splice(position.block_index, 0, inline)

					structure$.next(state)
				},
			}),
		)

		R.FromNullable(content)
			.pipe(R.ops.chain(x => R.If(is_string(x), { T: () => x as string })))
			.pipe(R.ops.chain(json => R.Try(() => JSON.parse(json))))
			.pipe(R.ops.chain(x => R.If(is_array(x) && x.length > 0, { T: () => x })))
			.cata({
				Ok: x => structure$.next(x as TEditorStructure),
				Err: () => structure$.next([{ type: "p", children: [{ type: "text", value: "" }] }]),
			})

		return () => {
			const state = structure$.getValue()

			return [...state.map((node, block_index) => Line(node, metadata, block_index))]
		}
	})
}
