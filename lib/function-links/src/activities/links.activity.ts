import { PiGraph } from "react-icons/pi"
import { lazy } from "react"

import LinksWidget from "../components/links.widget"

type P = { commands: Client.Commands.Commands }
export const registerLinksActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		name: "pink.ordo.links.main",
		Component: lazy(() => import("../components/links.workspace")),
		routes: ["/links", "/links/:label"],
		widgets: [LinksWidget],
		background: false,
		Icon: PiGraph,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", "pink.ordo.links.main")
	}
}
