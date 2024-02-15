import { BsFolder2Open } from "react-icons/bs"
import { lazy } from "react"

type P = { commands: Client.Commands.Commands }
export const registerFileExplorerActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		name: "pink.ordo.file-explorer.main",
		Component: lazy(() => import("../views/file-explorer.workspace")),
		routes: ["/fs", "/fs/:fsid"],
		widgets: [lazy(() => import("../views/file-explorer.widget"))],
		background: false,
		Icon: BsFolder2Open,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", "pink.ordo.file-explorer.main")
	}
}
