import { lazy } from "react"

type P = { commands: Client.Commands.Commands }
export const registerUserActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: lazy(() => import("../components/user.workspace")),
		name: "pink.ordo.user.main",
		routes: ["/user"],
		background: true,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", "pink.ordo.user.main")
	}
}
