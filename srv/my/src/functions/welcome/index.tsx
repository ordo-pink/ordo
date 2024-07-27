import { type Root, createRoot } from "react-dom/client"
import { BsCollection } from "react-icons/bs"

import { O, type TOption } from "@ordo-pink/option"
import { create_function } from "@ordo-pink/core"

import LandingWorkspace from "./views/landing.workspace"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks/src/use-ordo-context.hook"

declare global {
	module cmd {
		module welcome {
			type to_welcome_page = { name: "welcome.go-to-welcome" }
			type open_telegram_support = { name: "welcome.open-telegram-support" }
			type open_email_support = { name: "welcome.open-email-support" }
			type open_support = { name: "welcome.open-support" }
		}
	}
}

export default create_function(
	"pink.ordo.welcome",
	{
		queries: [
			"application.commands",
			"application.hosts",
			"users.current_user.is_authenticated",
			"application.fetch",
		],
		commands: [
			"application.set_title",
			"activities.register",
			"auth.open_sign_up",
			"auth.open_sign_in",
			"application.add_translations",
			"router.navigate",
			"router.open_external",
		],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()

		let workspace_root_option: TOption<Root>

		commands.emit<cmd.application.add_translations>("application.add_translations", {
			lang: "en",
			prefix: "pink.ordo.welcome",
			translations: EN_TRANSLATIONS,
		})

		commands.emit<cmd.activities.register>("activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.welcome.landing-page",
				render_workspace: div => {
					workspace_root_option = O.Some(createRoot(div))
					workspace_root_option.unwrap()!.render(
						<Provider value={ctx}>
							<LandingWorkspace />
						</Provider>,
					)
				},
				render_icon: span => {
					createRoot(span).render(<BsCollection />)
				},
				routes: ["/"],
				on_unmount: () => {
					workspace_root_option.pipe(O.ops.map(root => root.unmount()))
				},
			},
		})
	},
)

const EN_TRANSLATIONS: Record<string, string> = {
	beta_started_announcement: "public beta is live!",
	cookies_warning: "We don't use cookies! Wait, what?",
	title: "One space for docs, files and projects",
	auth_title: "Welcome back!",
}
