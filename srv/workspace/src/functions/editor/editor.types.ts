import { FSID } from "@ordo-pink/data"
import { Descendant, Element } from "slate"

declare global {
	module cmd {
		module editor {
			type goToEditor = { name: "editor.go-to-editor" }
			type open = { name: "editor.open"; payload: FSID }
		}
	}
}

export type OrdoDescendant = Descendant & { type: string }
export type OrdoElement = Element & { type: string }

export {}
