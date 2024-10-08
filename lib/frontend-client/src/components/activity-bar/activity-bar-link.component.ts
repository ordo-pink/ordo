import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ActivityBarIcon } from "./activity-bar-icon.component"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

type P = Pick<Ordo.Activity.Instance, "default_route"> &
	Required<Pick<Ordo.Activity.Instance, "render_icon" | "routes" | "name">> & {
		current_activity_name?: Ordo.Activity.Instance["name"]
	}
export const ActivityBarLink = ({
	render_icon,
	default_route,
	routes,
	name,
	current_activity_name,
}: P) =>
	Maoka.create("a", ({ use }) => {
		const activity_link = default_route ?? routes[0]

		use(MaokaJabs.set_class("activity-bar_link"))
		use(MaokaJabs.set_attribute("href", activity_link))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const { emit } = use(MaokaOrdo.Jabs.Commands)
		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			emit("cmd.application.router.navigate", activity_link)
		}

		return () => ActivityBarIcon({ name, render_icon, current_activity_name })
	})
