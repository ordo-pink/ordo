import { BsLayoutSidebar } from "react-icons/bs"
import { lazy } from "react"

import { ORDO_PINK_EDITOR_FUNCTION } from "@ordo-pink/core"

const name = ORDO_PINK_EDITOR_FUNCTION.concat(".activity")

type P = { commands: Client.Commands.Commands }
export const registerEditorActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: lazy(() => import("../views/editor.workspace")),
		Sidebar: lazy(() => import("../views/editor.sidebar")),
		Icon: BsLayoutSidebar,
		name,
		routes: ["/editor", "/editor/:fsid"],
		background: false,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", name)
	}
}
