import { ZAGS } from "@ordo-pink/zags"

import { type TEditorState } from "../rich-text.types"

export const rich_text_editor$ = ZAGS.Of<TEditorState>({
	content: [{ type: "p", children: [{ type: "text", value: "" }] }],
	is_editable: false,
	is_embedded: false,
	selection: { anchor: 0, block: 0, focus: 0, inline: 0 },
})
