/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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
	add_block: (block: TOrdoRichTextEditorBlockNode, refocus?: boolean) => void
	add_inline: (inline: TOrdoRichTextEditorInlineNode, refocus?: boolean) => void
	remove_block: (block_index: number, refocus?: boolean) => void
	// remove_inline: (block_index: number, inline_index: number, focus?: "next" | "previous") => void
	add_new_line: (refocus?: boolean) => void
	set_caret_position: TSetCaretPositionFn
}
