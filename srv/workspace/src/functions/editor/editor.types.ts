import { FSID } from "@ordo-pink/data"

declare global {
	module cmd {
		module editor {
			type goToEditor = { name: "editor.go-to-editor" }
			type open = { name: "editor.open"; payload: FSID }
		}
	}
}

export {}
