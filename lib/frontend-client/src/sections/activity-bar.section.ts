import { Observable, combineLatestWith, map } from "rxjs"

import { TLogger } from "@ordo-pink/logger"
import { TOption } from "@ordo-pink/option"

export const init_activity_bar = (
	logger: TLogger,
	commands: Client.Commands.Commands,
	activities$: Observable<Functions.Activity[]>,
	current_activity$: Observable<TOption<Functions.Activity>>,
) => {
	logger.debug("🟡 Initialising activity bar...")

	const activity_bar_element = document.querySelector("#activity-bar") as HTMLDivElement
	activity_bar_element.oncontextmenu = event =>
		commands.emit<cmd.ctx_menu.show>("context-menu.show", { event: event as any })

	const activity_bar_activities$ = activities$.pipe(
		map(as => as.filter(a => !a.is_background && !!a.render_icon)),
	)

	activity_bar_activities$
		.pipe(combineLatestWith(current_activity$))
		.subscribe(([activities, current_activity_option]) => {
			activity_bar_element.innerHTML = ""

			for (const activity of activities) {
				const a = document.createElement("a")
				const span = document.createElement("span")
				const current_activity = current_activity_option.unwrap()

				a.classList.add("decoration-none", "no-underline")
				a.href = activity.default_route ?? activity.routes[0]
				a.onclick = event => {
					event.preventDefault()
					commands.emit<cmd.router.navigate>(
						"router.navigate",
						activity.default_route ?? activity.routes[0],
					)
				}
				a.appendChild(span)
				a.setAttribute("title", activity.name)

				if (activity.name === current_activity?.name) span.classList.add("text-pink-500")

				activity.render_icon!(span)

				activity_bar_element.appendChild(a)
			}
		})

	logger.debug("🟢 Initialised activity bar.")
}
