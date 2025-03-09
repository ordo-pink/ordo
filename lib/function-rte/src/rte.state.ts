import { ZAGS } from "@ordo-pink/zags"

import { type TRTEState } from "./rte.types"

export const rich_text_editor$ = ZAGS.Of<TRTEState>({
	content: [{ type: "p", children: [{ type: "text", value: "" }] }],
	is_editable: false,
	is_embedded: false,
	selection: { anchor: 0, block: 0, focus: 0, inline: 0 },
})
