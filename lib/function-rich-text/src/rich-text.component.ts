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
import { Switch } from "@ordo-pink/switch"

type TOrdoRichTextEditorNode = { type: string }

type TOrdoRichTextEditorInlineNode<$TValue = any> = TOrdoRichTextEditorNode & { value: $TValue }

type TOrdoRichTextEditorBlockNode = TOrdoRichTextEditorNode & {
	children: TOrdoRichTextEditorInlineNode<any>[]
}

type TEditorStructure = TOrdoRichTextEditorBlockNode[]
type TEditorFocusPosition = { block_index: number; inline_index: number; offset: number }
export type TEditorContext = {
	position$: BehaviorSubject<TEditorFocusPosition>
	structure$: BehaviorSubject<TEditorStructure>
	add_block: (block: TOrdoRichTextEditorBlockNode, focus?: boolean) => void
	add_inline: (inline: TOrdoRichTextEditorInlineNode, focus?: boolean) => void
	add_new_line: (focus?: boolean) => void
	set_position: (position: TEditorFocusPosition) => void
}
const editor_context = MaokaJabs.create_context<TEditorContext>()

export const RichText = (
	metadata: Ordo.Metadata.Instance,
	content: Ordo.Content.Instance,
	ctx: Ordo.CreateFunction.Params,
) => {
	const position$ = new BehaviorSubject<TEditorFocusPosition>({
		block_index: 0,
		inline_index: 0,
		offset: 0,
	})

	const structure$ = new BehaviorSubject<TEditorStructure>([
		{ type: "p", children: [{ type: "text", value: "" }] },
	])

	return Maoka.create("div", ({ use, refresh }) => {
		use(MaokaJabs.set_class("p-2 size-full outline-none cursor-text"))
		use(MaokaJabs.set_attribute("contenteditable", "true"))
		use(MaokaOrdo.Context.provide(ctx))
		use(
			editor_context.provide({
				position$,
				structure$,
				set_position: position => {
					position$.next(position)
					console.log(position)
				},
				// TODO Remove block
				// TODO Remove inline
				add_block: (block, focus = true) => {
					const { position$, set_position } = use(editor_context.consume)
					const position = position$.getValue()
					const state = structure$.getValue()

					// TODO Move chars from previous line

					state.splice(position.block_index + 1, 0, block)

					structure$.next(state)

					if (focus)
						set_position({ block_index: position.block_index + 1, inline_index: 0, offset: 0 })

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

			return [
				...state.map((node, block_index) =>
					Maoka.create("div", ({ use }) => {
						use(MaokaJabs.set_class("flex items-center space-x-2"))
						use(MaokaJabs.set_attribute("contenteditable", "false"))

						return () => [
							Maoka.create("div", ({ use }) => {
								use(MaokaJabs.set_class("w-12 text-right font-mono text-neutral-500"))
								return () => String(block_index + 1)
							}),
							Block(node, metadata, block_index),
						]
					}),
				),
			]
		}
	})
}

const Block = (
	node: TOrdoRichTextEditorBlockNode,
	metadata: Ordo.Metadata.Instance,
	block_index: number,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("outline-none cursor-text"))
		use(MaokaJabs.set_attribute("contenteditable", "false"))

		return () =>
			node.children.map((child, child_index) => Inline(child, metadata, block_index, child_index))
	})

const Inline = (
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

			const commands = use(MaokaOrdo.Jabs.Commands)
			const { position$, structure$, add_new_line, set_position } = use(editor_context.consume)

			after_mount(() => {
				const current_position = position$.getValue()

				if (
					current_position.block_index === block_index &&
					current_position.inline_index === inline_index
				) {
					set_position({ block_index, inline_index, offset: 0 })
					;(element as unknown as HTMLDivElement).focus()
				}
			})

			use(
				MaokaJabs.listen("onfocus", () => {
					set_position({ block_index, inline_index, offset: 0 })
				}),
			)

			const handle_keydown = (event: KeyboardEvent) => {
				if (event.key === "Enter") {
					event.preventDefault()
					event.stopPropagation()

					add_new_line()
				}
			}

			document.addEventListener("keydown", handle_keydown)

			on_unmount(() => document.removeEventListener("keydown", handle_keydown))

			use(
				MaokaJabs.listen("oninput", event => {
					const state = structure$.getValue()
					const target = event.target as HTMLDivElement

					state[block_index].children[inline_index].value = target.innerText
					structure$.next(state)

					commands.emit("cmd.content.set", { fsid, content_type, content: JSON.stringify(state) })
				}),
			)

			return () => node.value
		}),
	)
