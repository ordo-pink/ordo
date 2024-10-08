import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TOption } from "@ordo-pink/option"

import { ActivityBarLink } from "./activity-bar-link.component"

import "./activity-bar.css"

export const ActivityBar = (
	ctx: Ordo.CreateFunction.Params,
	ca$: Observable<TOption<Ordo.Activity.Instance>>,
	as$: Observable<Ordo.Activity.Instance[]>,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		use(MaokaJabs.set_class("activity-bar"))
		use(MaokaJabs.listen("oncontextmenu", event => handle_context_menu(event)))

		const init_as = [] as Ordo.Activity.Instance[]
		const init_a = void 0
		const commands = use(MaokaOrdo.Jabs.Commands)
		const get_list = use(MaokaOrdo.Jabs.from$(as$, init_as))
		const get_current = use(MaokaOrdo.Jabs.from$(ca$, init_a, x => x.unwrap()))

		const handle_context_menu = (event: MouseEvent) => {
			event.preventDefault()
			commands.emit("cmd.application.context_menu.show", { event })
		}

		return () => {
			const activities = get_list()
			const current_activity = get_current()

			return activities.map(
				({ name, routes, default_route, render_icon }) =>
					render_icon &&
					ActivityBarLink({
						name,
						routes,
						default_route,
						render_icon,
						current_activity_name: current_activity?.name,
					}),
			)
		}
	})
