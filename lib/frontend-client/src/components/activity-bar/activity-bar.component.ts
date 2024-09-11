import { Observable } from "rxjs"
import { equals } from "ramda"

import { O, type TOption } from "@ordo-pink/option"
import { create, listen, set_class } from "@ordo-pink/maoka"
import { get_commands, ordo_context, rx_subscription } from "@ordo-pink/maoka-ordo-hooks"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { ActivityBarLink } from "./activity-bar-link.component"

export const ActivityBar = (
	ctx: TCreateFunctionContext,
	current_activity$: Observable<TOption<Functions.Activity>>,
	activities$: Observable<Functions.Activity[]>,
) =>
	create("div", ({ use }) => {
		use(ordo_context.provide(ctx))
		use(set_class("h-full flex flex-col space-y-4 items-center justify-center"))
		use(
			listen("oncontextmenu", event => {
				event.preventDefault()
				commands.emit("cmd.application.context_menu.show", { event: event as any })
			}),
		)

		const activities = use(rx_subscription(activities$, "activities", [], (a, b) => !equals(a, b)))
		const current_activity = use(
			rx_subscription(
				current_activity$,
				"current_activity",
				O.None(),
				(a, b) => a.is_none !== b.is_none || a.unwrap()?.name !== b.unwrap()?.name,
			),
		).unwrap()
		const commands = use(get_commands)

		return activities.map(
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
