import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { Inline } from "./inline.component"
import { type TOrdoRichTextEditorBlockNode } from "../rich-text.types"

export const Line = (
	node: TOrdoRichTextEditorBlockNode,
	metadata: Ordo.Metadata.Instance,
	block_index: number,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("flex items-center space-x-2"))
		use(MaokaJabs.set_attribute("contenteditable", "false"))

		return () => [LineNumber(() => String(block_index + 1)), Block(node, metadata, block_index)]
	})

// --- Internal ---

const LineNumber = Maoka.styled("div", { class: "w-12 text-right font-mono text-neutral-500" })

const Block = (
	node: TOrdoRichTextEditorBlockNode,
	metadata: Ordo.Metadata.Instance,
	block_index: number,
) =>
	Maoka.create("div", ({ use, element }) => {
		use(MaokaJabs.set_class("outline-none cursor-text w-full"))
		use(MaokaJabs.set_attribute("contenteditable", "false"))

		use(
			MaokaJabs.listen("onclick", event => {
				event.stopPropagation()

				if (!element.children) return

				const last_child = element.children[element.children.length - 1]

				if (!last_child || !(last_child instanceof HTMLElement)) return

				last_child.focus()
			}),
		)

		return () =>
			node.children.map((child, child_index) => Inline(child, metadata, block_index, child_index))
	})
