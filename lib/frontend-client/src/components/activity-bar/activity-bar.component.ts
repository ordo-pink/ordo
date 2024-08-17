import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { ActivityBarLink } from "./activity-bar-link.component"
import { type TActivityHook } from "../../hooks/use-activities.hook"

const div = create<TActivityHook & TOrdoHooks>("div")

export const ActivityBar = div(use => {
	use.set_attribute("class", "h-full flex flex-col space-y-4 items-center justify-center")
	use.set_listener("oncontextmenu", event => {
		event.preventDefault()
		commands.emit("cmd.application.context_menu.show", { event: event as any })
	})

	const activities = use.activities()
	const commands = use.get_commands()

	return activities.map(
		({ name, routes, default_route, render_icon }) =>
			render_icon && ActivityBarLink({ name, routes, default_route, render_icon }),
	)
})
