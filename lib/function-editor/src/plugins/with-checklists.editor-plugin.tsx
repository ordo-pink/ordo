import { Editor, Point, Range, Transforms } from "slate"
import { ReactEditor } from "slate-react"

import { OrdoElement } from "../editor.types"
import { isOrdoElement } from "../guards/is-ordo-element.guard"

export const withChecklists = <T extends ReactEditor>(editor: T): T => {
	const { deleteBackward } = editor

	editor.deleteBackward = (...args) => {
		const { selection } = editor

		if (selection && Range.isCollapsed(selection)) {
			const nodes = Editor.nodes(editor, {
				match: node =>
					!Editor.isEditor(node) && isOrdoElement(node) && node.type === "check-list-item",
			})

			const match = nodes.next().value

			if (match) {
				const [, path] = match
				const start = Editor.start(editor, path)

				if (Point.equals(selection.anchor, start)) {
					const newProperties: Partial<OrdoElement> = {
						type: "paragraph",
					}

					Transforms.setNodes(editor, newProperties, {
						match: node =>
							!Editor.isEditor(node) && isOrdoElement(node) && node.type === "check-list-item",
					})

					return editor
				}
			}
		}

		deleteBackward(...args)
	}

	return editor
}
