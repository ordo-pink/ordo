import { MaokaStyled } from "@ordo-pink/maoka-styled"

import { Inline } from "../inline.component"
import { type TRTEParagraphNode } from "../../rte.types"

export const Paragraph = (node: TRTEParagraphNode, index: number) =>
	StyledParagraph(() => {
		return () => node.children.map((child, inline_index) => Inline(child, index, inline_index))
	})

// --- Internal ---

const StyledParagraph = MaokaStyled.Tags.div("cursor-text w-full px-1")
