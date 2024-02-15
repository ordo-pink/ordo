import { PiGraph } from "react-icons/pi"
import { lazy } from "react"

type P = { commands: Client.Commands.Commands }
export const registerLinksActivity = ({ commands }: P) => {
	const widget = lazy(() => import("../views/links.widget"))
	const Component = lazy(() => import("../views/links.workspace"))
	const Sidebar = lazy(() => import("../views/links.sidebar"))

	commands.emit<cmd.activities.add>("activities.add", {
		name: "pink.ordo.links.main",
		Sidebar,
		Component,
		routes: ["/links", "/links/labels/:label"],
		widgets: [widget],
		background: false,
		Icon: PiGraph,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", "pink.ordo.links.main")
	}
}
