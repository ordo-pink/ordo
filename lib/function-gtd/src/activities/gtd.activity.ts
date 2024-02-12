import { BsUiChecks } from "react-icons/bs"
import { lazy } from "react"

type P = { commands: Client.Commands.Commands }
export const registerGTDActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: lazy(() => import("../views/gtd.workspace")),
		Sidebar: lazy(() => import("../views/gtd.sidebar")),
		widgets: [lazy(() => import("../views/gtd.widget"))],
		name: "pink.ordo.gtd.main",
		routes: ["/gtd", "/gtd/projects/:fsid", "/gtd/labels/:label"],
		background: false,
		Icon: BsUiChecks,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", "pink.ordo.gtd.main")
	}
}
