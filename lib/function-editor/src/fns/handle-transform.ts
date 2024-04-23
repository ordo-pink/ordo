import { Editor, Range, Transforms } from "slate"

import { BulletedListElement, NumericListElement } from "../plugins/with-shortcuts.editor-plugin"
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
