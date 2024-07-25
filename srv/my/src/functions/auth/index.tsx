import { type Root, createRoot } from "react-dom/client"
import { BsBoxArrowInRight } from "react-icons/bs"

import { O, type TOption } from "@ordo-pink/option"
import { create_function } from "@ordo-pink/core"

import Auth from "./views/auth.workspace"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks/src/use-ordo-context.hook"

export default create_function(
	"pink.ordo.auth",
	{
		queries: [
			"users.current_user.is_authenticated",
			"application.commands",
			"application.current_route",
			"application.hosts",
		],
		commands: [
			"application.set_title",
			"activities.register",
			"activities.unregister",
			"auth.open-sign-in",
			"auth.open-sign-up",
			"router.navigate",
		],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()

		let workspace_root_option: TOption<Root> = O.None()

		commands.on("auth.open-sign-in", () =>
			commands.emit<cmd.router.navigate>("router.navigate", "/auth/sign-in"),
		)
		commands.on("auth.open-sign-up", () =>
			commands.emit<cmd.router.navigate>("router.navigate", "/auth/sign-up"),
		)

		commands.emit<cmd.activities.register>("activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.auth.authentication",
				routes: ["/auth", "/auth/:action"],
				is_background: false,
				is_fullscreen: false,
				render_icon: span => {
					createRoot(span).render(<BsBoxArrowInRight />)
				},
				render_workspace: div => {
					workspace_root_option = O.Some(createRoot(div))
					workspace_root_option.unwrap()!.render(
						<Provider value={ctx}>
							<Auth />
						</Provider>,
					)
				},
				on_unmount: () => {
					workspace_root_option.pipe(O.ops.map(root => root.unmount()))
				},
			},
		})
	},
)
