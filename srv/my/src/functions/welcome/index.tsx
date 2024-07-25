import { type Root, createRoot } from "react-dom/client"
import { BsAirplaneFill } from "react-icons/bs"

import { O, type TOption } from "@ordo-pink/option"
import { create_function } from "@ordo-pink/core"

import LandingWorkspace from "./views/landing.workspace"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks/src/use-ordo-context.hook"

export default create_function(
	"pink.ordo.website",
	{
		queries: ["application.commands", "application.hosts"],
		commands: ["application.set_title", "activities.register"],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()

		let workspace_root_option: TOption<Root>

		commands.emit<cmd.activities.register>("activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.website.landing-page",
				render_workspace: div => {
					workspace_root_option = O.Some(createRoot(div))
					workspace_root_option.unwrap()!.render(
						<Provider value={ctx}>
							<LandingWorkspace />
						</Provider>,
					)
				},
				render_icon: span => {
					createRoot(span).render(<BsAirplaneFill />)
				},
				routes: ["/"],
				on_unmount: () => {
					workspace_root_option.pipe(O.ops.map(root => root.unmount()))
				},
			},
		})
	},
)
