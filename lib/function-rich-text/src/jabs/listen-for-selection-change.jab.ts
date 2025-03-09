import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { type TMaokaJab } from "@ordo-pink/maoka"

import { RTE } from ".."
import { type TEditorSelection } from "../../rich-text.types"

export const listen_for_selection_change_jab =
	(block_index: number, inline_index: number): TMaokaJab =>
	({ element, use }) => {
		const cheat_on_selection = (s: TEditorSelection) => {
			const window_selection = window.getSelection()

			if (!window_selection || !MaokaDOM.is_maoka_dom_element(element) || s.block !== block_index || s.inline !== inline_index)
				return

			const range = new Range()
			const node = element.childNodes[0] ?? element
			const is_reverse_selection = s.anchor > s.focus

			range.setStart(node, is_reverse_selection ? s.focus : s.anchor)

			if (s.anchor !== s.focus) {
				range.setEnd(element.childNodes[0] ?? element, is_reverse_selection ? s.anchor : s.focus)
			}

			window_selection.removeAllRanges()
			window_selection.addRange(range)
			element.scrollIntoView({ behavior: "smooth", block: "center" })
		}

		use(MaokaDOM.Jabs.onmount(() => RTE.$.cheat("selection", cheat_on_selection)))
	}
