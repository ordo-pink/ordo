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

import { Editor, Element, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"

import { OrdoDescendant, OrdoElement } from "../editor.types"
import { SHORTCUTS } from "../editor.constants"
import { isOrdoElement } from "../guards/is-ordo-element.guard"

export type BulletedListElement = {
	type: "unordered-list"
	children: OrdoDescendant[]
}

export type NumericListElement = {
	type: "ordered-list"
	children: OrdoDescendant[]
}

export const withShortcuts = <T extends ReactEditor>(editor: T): T => {
	const { deleteBackward, insertText } = editor

	editor.insertText = text => {
		const { selection } = editor

		if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
			const { anchor } = selection
			const block = Editor.above(editor, {
				match: n => isOrdoElement(n) && Editor.isBlock(editor, n),
			})
			const path = block ? block[1] : []
			const start = Editor.start(editor, path)
			const range = { anchor, focus: start }
			const beforeText = (Editor.string(editor, range) +
				text.slice(0, -1)) as keyof typeof SHORTCUTS
			const type = SHORTCUTS[beforeText]

			if (type) {
				Transforms.select(editor, range)

				if (!Range.isCollapsed(range)) {
					Transforms.delete(editor)
				}

				const newProperties: Partial<OrdoElement> = {
					type,
				}
				Transforms.setNodes<Element>(editor, newProperties, {
					match: n => isOrdoElement(n) && Editor.isBlock(editor, n),
				})

				if (type === "list-item") {
					const list: BulletedListElement = {
						type: "unordered-list",
						children: [],
					}
					Transforms.wrapNodes(editor, list, {
						match: node =>
							!Editor.isEditor(node) && isOrdoElement(node) && node.type === "list-item",
					})
				}

				if (type === "number-list-item") {
					const list: NumericListElement = {
						type: "ordered-list",
						children: [],
					}
					Transforms.wrapNodes(editor, list, {
						match: node =>
							!Editor.isEditor(node) && isOrdoElement(node) && node.type === "number-list-item",
					})
				}

				return
			}
		}

		insertText(text)
	}

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
					block.type !== "paragraph" &&
					Point.equals(selection.anchor, start)
				) {
					const newProperties: Partial<OrdoElement> = {
						type: "paragraph",
					}
					Transforms.setNodes(editor, newProperties)

					if (block.type === "list-item") {
						Transforms.unwrapNodes(editor, {
							match: n => !Editor.isEditor(n) && isOrdoElement(n) && n.type === "unordered-list",
							split: true,
						})
					}

					if (block.type === "number-list-item") {
						Transforms.unwrapNodes(editor, {
							match: n => !Editor.isEditor(n) && isOrdoElement(n) && n.type === "ordered-list",
							split: true,
						})
					}

					return
				}
			}

			deleteBackward(...args)
		}
	}

	return editor
}
