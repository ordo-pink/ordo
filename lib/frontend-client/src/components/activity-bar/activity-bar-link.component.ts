import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { ActivityBarIcon } from "./activity-bar-icon.component"
import { type TActivityHook } from "../../hooks/use-activities.hook"

const a = create<TActivityHook & TOrdoHooks>("a")

type P = Pick<Functions.Activity, "default_route"> &
	Required<Pick<Functions.Activity, "render_icon" | "routes" | "name">>
export const ActivityBarLink = ({ render_icon, default_route, routes, name }: P) => {
	const activity_link = default_route ?? routes[0]

	return a(use => {
		const commands = use.get_commands()

		use.set_attribute("class", "decoration-none no-underline !text-800 dark:!text-neutral-200")
		use.set_attribute("href", activity_link)
		use.set_listener("onclick", event => {
			event.preventDefault()
			commands.emit("cmd.application.router.navigate", activity_link)
		})

		return ActivityBarIcon({ name, render_icon })
	})
}
