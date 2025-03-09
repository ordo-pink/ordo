import { type TRTEContent, type TRTEParagraphNode, type TRTESelection } from "./rte.types"

export const create_paragraph = (): TRTEParagraphNode => ({
	type: "p",
	children: [{ type: "text", value: "", styles: [] }],
})

export const create_content = (): TRTEContent => [create_paragraph()]

export const create_selection = (): TRTESelection => ({ anchor: 0, block: 0, focus: 0, inline: 0 })
