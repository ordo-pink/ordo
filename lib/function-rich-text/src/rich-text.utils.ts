import { TEditorContent, TEditorSelection, TOrdoRTEParagraphNode } from "../rich-text.types"

export const create_paragraph = (): TOrdoRTEParagraphNode => ({
	type: "p",
	children: [{ type: "text", value: "", styles: [] }],
})

export const create_content = (): TEditorContent => [create_paragraph()]

export const create_selection = (): TEditorSelection => ({ anchor: 0, block: 0, focus: 0, inline: 0 })
