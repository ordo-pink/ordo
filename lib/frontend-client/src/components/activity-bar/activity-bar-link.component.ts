import { create, listen, set_attribute, set_class } from "@ordo-pink/maoka"
import { get_commands } from "@ordo-pink/maoka-ordo-hooks"

import { ActivityBarIcon } from "./activity-bar-icon.component"

type P = Pick<Functions.Activity, "default_route"> &
	Required<Pick<Functions.Activity, "render_icon" | "routes" | "name">> & {
		current_activity?: Functions.Activity["name"]
	}
export const ActivityBarLink = ({
	render_icon,
	default_route,
	routes,
	name,
	current_activity,
}: P) => {
	const activity_link = default_route ?? routes[0]

	return create("a", ({ use }) => {
		const commands = use(get_commands)

		use(set_class("decoration-none no-underline !text-800 dark:!text-neutral-200"))
		use(set_attribute("href", activity_link))
		use(
			listen("onclick", event => {
				event.preventDefault()
				commands.emit("cmd.application.router.navigate", activity_link)
			}),
		)

		return ActivityBarIcon({ name, render_icon, current_activity })
	})
}
