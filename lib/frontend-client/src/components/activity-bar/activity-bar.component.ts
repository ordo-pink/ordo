import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TOption } from "@ordo-pink/option"

import { ActivityBarLink } from "./activity-bar-link.component"

export const ActivityBar = (
	ctx: Ordo.CreateFunction.Params,
	current_activity$: Observable<TOption<Ordo.Activity.Instance>>,
	activities$: Observable<Ordo.Activity.Instance[]>,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		use(MaokaOrdo.Context.provide(ctx))

		let current_activity: Ordo.Activity.Instance | null = null
		let activities: Ordo.Activity.Instance[] = []

		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const handle_activities_update = (new_activities: Ordo.Activity.Instance[]) => {
			if (new_activities.length !== activities.length) {
				activities = new_activities
				void refresh()
			}
		}

		const handle_current_activity_update = (
			new_activity_option: TOption<Ordo.Activity.Instance>,
		) => {
			const new_activity = new_activity_option.unwrap() ?? null

			if (current_activity?.name !== new_activity?.name) {
				current_activity = new_activity
				void refresh()
			}
		}

		use(MaokaJabs.set_class(activity_bar_class))
		use(MaokaJabs.listen("oncontextmenu", handle_context_menu(emit)))
		use(MaokaOrdo.Jabs.subscribe(activities$, handle_activities_update))
		use(MaokaOrdo.Jabs.subscribe(current_activity$, handle_current_activity_update))

		return () =>
			activities.map(
				({ name, routes, default_route, render_icon }) =>
					render_icon &&
					ActivityBarLink({
						name,
						routes,
						default_route,
						render_icon,
						current_activity: current_activity?.name,
					}),
			)
	})

// --- Internal ---

const activity_bar_class = "h-full flex flex-col space-y-4 items-center justify-center"

const handle_context_menu = (emit: Ordo.Command.Commands["emit"]) => (event: MouseEvent) => {
	event.preventDefault()
	emit("cmd.application.context_menu.show", { event: event as any })
}
