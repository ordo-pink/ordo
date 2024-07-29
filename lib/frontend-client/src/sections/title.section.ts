import { BehaviorSubject } from "rxjs"

import { call_once, is_non_empty_string, is_string, is_undefined } from "@ordo-pink/tau"
import { type TLogger } from "@ordo-pink/logger"
import { type TTitleState } from "@ordo-pink/core"

type TInitTitleStreamFn = (logger: TLogger, commands: Client.Commands.Commands) => void
export const init_title_display: TInitTitleStreamFn = call_once((logger, commands) => {
	logger.debug("🟡 Initialising title stream...")

	commands.on<cmd.application.set_title>(
		"application.set_title",
		state =>
			is_non_empty_string(state.window_title) &&
			(is_undefined(state.status_bar_title) || is_string(state.status_bar_title)) &&
			title$.next(state),
	)

	const title_element = document.querySelector("title") as HTMLTitleElement
	const status_bar_title_element = document.querySelector("#status-bar_title") as HTMLDivElement

	title$.subscribe(({ window_title, status_bar_title = window_title }) => {
		title_element.innerText = `${window_title} | Ordo.pink`
		status_bar_title_element.innerText = status_bar_title
	})

	logger.debug("🟢 Initialised title.")
})

// --- Internal ---

const title$ = new BehaviorSubject<TTitleState>({
	window_title: "Loading...",
})
