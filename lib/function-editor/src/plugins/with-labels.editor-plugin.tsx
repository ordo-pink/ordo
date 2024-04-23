import { ReactEditor } from "slate-react"

export const withLabels = <T extends ReactEditor>(editor: T): T => {
	const { isInline, isVoid, markableVoid } = editor

	editor.isInline = element => {
		return (element as any).type === "label" ? true : isInline(element)
	}

	editor.isVoid = element => {
		return (element as any).type === "label" ? true : isVoid(element)
	}

	editor.markableVoid = element => {
		return (element as any).type === "label" || markableVoid(element)
	}

	return editor
}
