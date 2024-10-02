import { type Observable } from "rxjs"

import { OrdoHooks, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { type TOption } from "@ordo-pink/option"

import { ActivityBarLink } from "./activity-bar-link.component"

export const ActivityBar = (
	ctx: Ordo.CreateFunction.Params,
	current_activity$: Observable<TOption<Ordo.Activity.Instance>>,
	activities$: Observable<Ordo.Activity.Instance[]>,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		let current_activity: Ordo.Activity.Instance | null = null
		let activities: Ordo.Activity.Instance[] = []

		use(ordo_context.provide(ctx))

		const { emit } = use(OrdoHooks.commands)

		const handle_activities_update = (new_activities: Ordo.Activity.Instance[]) => {
			if (new_activities.length !== activities.length) {
				activities = new_activities
				refresh()
			}
		}

		const handle_current_activity_update = (
			new_activity_option: TOption<Ordo.Activity.Instance>,
		) => {
			const new_activity = new_activity_option.unwrap() ?? null

			if (current_activity?.name !== new_activity?.name) {
				current_activity = new_activity
				refresh()
			}
		}

		use(Maoka.hooks.set_class(activity_bar_class))
		use(Maoka.hooks.listen("oncontextmenu", handle_context_menu(emit)))
		use(OrdoHooks.subscription(activities$, handle_activities_update))
		use(OrdoHooks.subscription(current_activity$, handle_current_activity_update))

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
