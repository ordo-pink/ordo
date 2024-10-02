import { Maoka } from "@ordo-pink/maoka"
import { get_commands } from "@ordo-pink/maoka-ordo-hooks"

import { ActivityBarIcon } from "./activity-bar-icon.component"

type P = Pick<Ordo.Activity.Instance, "default_route"> &
	Required<Pick<Ordo.Activity.Instance, "render_icon" | "routes" | "name">> & {
		current_activity?: Ordo.Activity.Instance["name"]
	}
export const ActivityBarLink = ({
	render_icon,
	default_route,
	routes,
	name,
	current_activity,
}: P) => {
	const activity_link = default_route ?? routes[0]

	return Maoka.create("a", ({ use }) => {
		const { emit } = use(get_commands)

		use(Maoka.hooks.set_class("decoration-none no-underline !text-800 dark:!text-neutral-200"))
		use(Maoka.hooks.set_attribute("href", activity_link))
		use(click_listener(emit, activity_link))

		return () => ActivityBarIcon({ name, render_icon, current_activity_name: current_activity })
	})
}

const click_listener = (emit: Ordo.Command.Commands["emit"], activity_link: string) =>
	Maoka.hooks.listen("onclick", event => {
		event.preventDefault()
		emit("cmd.application.router.navigate", activity_link)
	})
