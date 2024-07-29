import { Observable, map } from "rxjs"

import { type TLogger } from "@ordo-pink/logger"

export const init_tray = (logger: TLogger, activities$: Observable<Functions.Activity[]>) => {
	logger.debug("🟡 Initialising tray...")

	const tray_activities$ = activities$.pipe(
		map(as => as.filter(a => a.is_background && !!a.render_icon)),
	)

	const tray_element = document.querySelector("#status-bar_tray_activities") as HTMLDivElement

	tray_activities$.subscribe(activities => {
		tray_element.innerHTML = ""

		for (const activity of activities) {
			const span = document.createElement("span")

			span.classList.add("cursor-pointer")
			span.setAttribute("title", activity.name)
			span.innerHTML = ""

			activity.render_icon!(span)

			tray_element.appendChild(span)
		}
	})

	logger.debug("🟢 Initialised tray.")
}
