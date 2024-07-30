// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Editor, Range, Transforms } from "slate"

// import { BulletedListElement, NumericListElement } from "../plugins/with-shortcuts.editor-plugin"
import { OrdoElement } from "../editor.types"
import { TNodeType } from "../editor.constants"
import { isOrdoElement } from "../guards/is-ordo-element.guard"

export const handleTransform = (editor: Editor, type: TNodeType): void => {
	if (!editor.selection) return

	const block = Editor.above(editor, {
		match: n => isOrdoElement(n) && Editor.isBlock(editor, n),
	})
	const path = block ? block[1] : []
	const start = Editor.start(editor, path)
	const range = { anchor: editor.selection.anchor, focus: start }

	Transforms.select(editor, range)

	if (!Range.isCollapsed(range)) {
		Transforms.delete(editor)
	}

	const newProperties: Partial<OrdoElement> = {
		type,
	}

	Transforms.setNodes<OrdoElement>(editor, newProperties, {
		match: n => isOrdoElement(n) && Editor.isBlock(editor, n),
	})

	// if (type === "list-item") {
	// 	const list: BulletedListElement = {
	// 		type: "unordered-list",
	// 		children: [],
	// 	}
	// 	Transforms.wrapNodes(editor, list, {
	// 		match: node => !Editor.isEditor(node) && isOrdoElement(node) && node.type === "list-item",
	// 	})
	// }

	// if (type === "number-list-item") {
	// 	const list: NumericListElement = {
	// 		type: "ordered-list",
	// 		children: [],
	// 	}
	// 	Transforms.wrapNodes(editor, list, {
	// 		match: node =>
	// 			!Editor.isEditor(node) && isOrdoElement(node) && node.type === "number-list-item",
	// 	})
	// }
}
