import { BsAirplaneFill } from "react-icons/bs"
import { createRoot } from "react-dom/client"

import { type TUnwrapOk } from "@ordo-pink/result"
import { create_function } from "@ordo-pink/core"

import LandingWorkspace from "./views/landing.workspace"

export default create_function(
	"pink.ordo.website",
	{
		queries: ["application.commands", "application.hosts"],
		commands: ["application.set_title", "activities.register"],
	},
	({ get_commands, get_hosts, fid }) => {
		const commands = get_commands()
		const hosts_result = get_hosts()
		const hosts = hosts_result.unwrap() as TUnwrapOk<typeof hosts_result>

		commands.emit<cmd.activities.register>("activities.register", {
			fid,
			activity: {
				name: "pink.ordo.website.landing-page",
				render_workspace: div =>
					createRoot(div).render(<LandingWorkspace commands={commands} hosts={hosts} />),
				render_icon: span => {
					createRoot(span).render(<BsAirplaneFill />)
				},
				routes: ["/"],
			},
		})
	},
)
