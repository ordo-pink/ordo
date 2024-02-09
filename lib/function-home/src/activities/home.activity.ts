import { BsCollection } from "react-icons/bs"
import { lazy } from "react"

type P = { commands: Client.Commands.Commands }
export const registerHomeActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		name: "pink.ordo.home.main",
		Component: lazy(() => import("../components/home.workspace")),
		routes: ["/"],
		background: false,
		Icon: BsCollection,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", "pink.ordo.home.main")
	}
}
