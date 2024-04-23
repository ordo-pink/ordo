import { ReactEditor } from "slate-react"

export const withLinks = <T extends ReactEditor>(editor: T): T => {
	const { isInline, isVoid, markableVoid } = editor

	editor.isInline = element => {
		return (element as any).type === "link" ? true : isInline(element)
	}

	editor.isVoid = element => {
		return (element as any).type === "link" ? true : isVoid(element)
	}

	editor.markableVoid = element => {
		return (element as any).type === "link" || markableVoid(element)
	}

	return editor
}
