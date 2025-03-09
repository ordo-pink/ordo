import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { Switch } from "@ordo-pink/switch"

import { Inline } from "../inline.component"
import { type TRTEHeaderNode } from "../../rte.types"

export const Header = (node: TRTEHeaderNode, index: number) =>
	Switch.Match(node.level)
		.case(1, () => StyledH1(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))))
		.case(2, () => StyledH2(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))))
		.case(3, () => StyledH3(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))))
		.case(4, () => StyledH4(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))))
		.case(5, () => StyledH5(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))))
		.case(6, () => StyledH6(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))))
		.default(() => "INVALID HEADER")

// --- Internal ---

const StyledH1 = MaokaStyled.Tags.h1("cursor-text w-full text-3xl font-black px-1")
const StyledH2 = MaokaStyled.Tags.h2("cursor-text w-full text-2xl font-extrabold px-1")
const StyledH3 = MaokaStyled.Tags.h3("cursor-text w-full text-xl font-bold px-1")
const StyledH4 = MaokaStyled.Tags.h4("cursor-text w-full text-xl px-1")
const StyledH5 = MaokaStyled.Tags.h5("cursor-text w-full text-lg font-bold px-1")
const StyledH6 = MaokaStyled.Tags.h6("cursor-text w-full text-lg px-1")
