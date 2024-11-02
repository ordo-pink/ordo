import type { BehaviorSubject } from "rxjs" // TODO: Replace with view

export type TOrdoRichTextEditorNode = { type: string }

export type TOrdoRichTextEditorInlineNode<$TValue = any> = TOrdoRichTextEditorNode & {
	value: $TValue
}

export type TOrdoRichTextEditorBlockNode = TOrdoRichTextEditorNode & {
	children: TOrdoRichTextEditorInlineNode<any>[]
}

export type TSetCaretPositionFn = (position: TEditorFocusPosition) => void

export type TEditorState = TOrdoRichTextEditorBlockNode[]
export type TEditorFocusPosition = {
	block_index: number
	inline_index: number
	anchor_offset: number
	focus_offset: number
}
export type TEditorContext = {
	caret_position$: BehaviorSubject<TEditorFocusPosition>
	state$: BehaviorSubject<TEditorState>
	add_block: (block: TOrdoRichTextEditorBlockNode, focus?: boolean) => void
	add_inline: (inline: TOrdoRichTextEditorInlineNode, focus?: boolean) => void
	remove_block: (block_index: number, focus?: "next" | "previous") => void
	// remove_inline: (block_index: number, inline_index: number, focus?: "next" | "previous") => void
	add_new_line: (focus?: boolean) => void
	set_caret_position: TSetCaretPositionFn
}
