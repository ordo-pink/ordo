import { interval } from "rxjs"

import { type TLogger } from "@ordo-pink/logger"

export const init_timer_display = (logger: TLogger) => {
	logger.debug("🟡 Initialising timer...")

	const time = document.querySelector("#status-bar_tray_time") as HTMLDivElement

	const render_time = () => {
		const date = new Date(Date.now())

		const hours = String(date.getHours())
		const minutes = String(date.getMinutes())

		time.innerText = `${hours}:${minutes.length === 1 ? `0${minutes}` : minutes}`
	}

	render_time()

	interval(300).subscribe(render_time)

	logger.debug("🟢 Initialised timer.")
}
