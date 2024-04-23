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

import { Editor, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"

import { OrdoDescendant, OrdoElement } from "../editor.types"
import { isOrdoElement } from "../guards/is-ordo-element.guard"

export type BulletedListElement = {
	type: "unordered-list"
	children: OrdoDescendant[]
}

export type NumericListElement = {
	type: "ordered-list"
	children: OrdoDescendant[]
}

export const withToC = <T extends ReactEditor>(editor: T): T => {
	const { deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const match = Editor.above(editor, {
				match: n => isOrdoElement(n) && Editor.isBlock(editor, n),
			})

			if (match) {
				const [block, path] = match
				const start = Editor.start(editor, path)

				if (
					!Editor.isEditor(block) &&
					isOrdoElement(block) &&
					block.type === "toc" &&
					Point.equals(selection.anchor, start)
				) {
					const newProperties: Partial<OrdoElement> = {
						type: "paragraph",
					}

					Transforms.setNodes(editor, newProperties)

					return
				}
			}
		}

		deleteBackward(...args)
	}

	return editor
}
