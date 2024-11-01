import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

import { TOrdoRichTextEditorInlineNode } from "../rich-text.types"
import { editor_context_jab } from "../jabs/editor-context.jab"

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

			const commands = use(MaokaOrdo.Jabs.Commands)
			const { position$, structure$, add_new_line, set_position } = use(editor_context_jab)

			after_mount(() => {
				const current_position = position$.getValue()

				if (
					current_position.block_index === block_index &&
					current_position.inline_index === inline_index
				) {
					// set_position({ block_index, inline_index, anchor_offset: 0, focus_offset: 0 })
					;(element as unknown as HTMLDivElement).focus()
				}
			})

			use(
				MaokaJabs.listen("onfocus", event => {
					event.stopPropagation()

					const selection = window.getSelection()

					// TODO Watch range instead
					const anchor_offset = selection?.anchorOffset ?? 0
					const focus_offset = selection?.focusOffset ?? 0

					set_position({ block_index, inline_index, anchor_offset, focus_offset })
				}),
			)

			use(
				MaokaJabs.listen("onmouseup", event => {
					event.stopPropagation()

					const selection = window.getSelection()

					// TODO Watch range instead
					const anchor_offset = selection?.anchorOffset ?? 0
					const focus_offset = selection?.focusOffset ?? 0

					set_position({ block_index, inline_index, anchor_offset, focus_offset })
				}),
			)

			const handle_keydown = (event: KeyboardEvent) => {
				if (document.activeElement !== element) return

				if (event.key === "Enter") {
					event.preventDefault()
					event.stopPropagation()

					add_new_line()
				}
			}

			document.addEventListener("keydown", handle_keydown)

			on_unmount(() => document.removeEventListener("keydown", handle_keydown))

			use(
				MaokaJabs.listen("onselectstart", () => {
					const selection = window.getSelection()

					const anchor_offset = selection?.anchorOffset ?? 0
					const focus_offset = selection?.focusOffset ?? 0

					position$.next({ block_index, anchor_offset, focus_offset, inline_index })
				}),
			)

			use(
				MaokaJabs.listen("oninput", event => {
					const state = structure$.getValue()
					const target = event.target as HTMLDivElement

					set_position({ block_index, inline_index })

					state[block_index].children[inline_index].value = target.innerText
					structure$.next(state)

					commands.emit("cmd.content.set", { fsid, content_type, content: JSON.stringify(state) })
				}),
			)

			return () => node.value
		}),
	)
