// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Editor, Element, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"

import { OrdoDescendant, OrdoElement } from "../editor.types"
import { isOrdoElement } from "../guards/is-ordo-element.guard"

const SHORTCUTS = {
	"*": "list-item",
	"-": "list-item",
	"+": "list-item",
	"1": "number-list-item",
	"2": "number-list-item",
	"3": "number-list-item",
	"4": "number-list-item",
	"5": "number-list-item",
	"6": "number-list-item",
	"7": "number-list-item",
	"8": "number-list-item",
	"9": "number-list-item",
	"0": "number-list-item",
	">": "block-quote",
	"#": "heading-1",
	"##": "heading-2",
	"###": "heading-3",
	"####": "heading-4",
	"#####": "heading-5",
}

export type BulletedListElement = {
	type: "bulleted-list"
	children: OrdoDescendant[]
}

export const withShortcuts = (editor: ReactEditor) => {
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
						type: "bulleted-list",
						children: [],
					}
					Transforms.wrapNodes(editor, list, {
						match: node =>
							!Editor.isEditor(node) && isOrdoElement(node) && node.type === "list-item",
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
							match: n => !Editor.isEditor(n) && isOrdoElement(n) && n.type === "bulleted-list",
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
