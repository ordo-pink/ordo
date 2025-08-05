/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { type TMaokaJab } from "@ordo-pink/oss-maoka"

import { RTE } from "../rte"
import { type TRTEEditorState } from "../rte.types"

export const listen_for_selection_change_jab =
	(fsid: Ordo.Metadata.FSID, block_index: number, inline_index: number): TMaokaJab =>
	({ element, use }) => {
		const cheat_on_selection = (s: TRTEEditorState) => {
			const focus = RTE.$.select("focus")
			const window_selection = window.getSelection()

			if (
				focus !== fsid ||
				!window_selection ||
				!MaokaDOM.is_maoka_dom_element(element) ||
				s.selection.block !== block_index ||
				s.selection.inline !== inline_index
			)
				return

			const range = new Range()
			const node = element.childNodes[0] ?? element
			const is_reverse_selection = s.selection.anchor > s.selection.focus

			range.setStart(node, is_reverse_selection ? s.selection.focus : s.selection.anchor)

			if (s.selection.anchor !== s.selection.focus) {
				range.setEnd(element.childNodes[0] ?? element, is_reverse_selection ? s.selection.anchor : s.selection.focus)
			}

			window_selection.removeAllRanges()
			window_selection.addRange(range)
			element.scrollIntoView({ behavior: "smooth", block: "center" })
		}

		use(MaokaDOM.Jabs.onmount(() => RTE.$.cheat(`state.${fsid}`, cheat_on_selection)))
	}
