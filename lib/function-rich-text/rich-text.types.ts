import type { BehaviorSubject } from "rxjs" // TODO: Replace with view

import type { PartlyRequired } from "@ordo-pink/tau"

export type TOrdoRichTextEditorNode = { type: string }

export type TOrdoRichTextEditorInlineNode<$TValue = any> = TOrdoRichTextEditorNode & {
	value: $TValue
}

export type TOrdoRichTextEditorBlockNode = TOrdoRichTextEditorNode & {
	children: TOrdoRichTextEditorInlineNode<any>[]
}

export type TEditorStructure = TOrdoRichTextEditorBlockNode[]
export type TEditorFocusPosition = {
	block_index: number
	inline_index: number
	anchor_offset: number
	focus_offset: number
}
export type TEditorContext = {
	position$: BehaviorSubject<TEditorFocusPosition>
	structure$: BehaviorSubject<TEditorStructure>
	add_block: (block: TOrdoRichTextEditorBlockNode, focus?: boolean) => void
	add_inline: (inline: TOrdoRichTextEditorInlineNode, focus?: boolean) => void
	add_new_line: (focus?: boolean) => void
	set_position: (
		position: PartlyRequired<TEditorFocusPosition, "block_index" | "inline_index">,
	) => void
}
