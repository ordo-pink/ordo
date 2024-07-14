// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BehaviorSubject, Observable, combineLatestWith, map, timer } from "rxjs"
import Split from "split.js"

import { ConsoleLogger } from "@ordo-pink/logger"
import { Switch } from "@ordo-pink/switch"
import { __init_activities } from "@ordo-pink/frontend-stream-activities"
import { __init_commands } from "@ordo-pink/frontend-stream-commands"
import { __init_fid } from "@ordo-pink/frontend-stream-fid"
import { __init_logger } from "@ordo-pink/frontend-logger"
import { __init_title$ } from "@ordo-pink/frontend-stream-title"
import { noop } from "@ordo-pink/tau"

import { APP_FID } from "./constants"

import "@ordo-pink/css/main.css"

const main = () => {
	const { logger, get_logger } = __init_logger(ConsoleLogger)
	const { commands, get_commands } = __init_commands({ app_fid: APP_FID, logger })
	const { get_current_fid, set_current_fid } = __init_fid()
	const { register_activity, set_current_activity, get_current_activity, get_activities } =
		__init_activities()
	const { get_title } = __init_title$(logger, commands)

	set_current_fid(APP_FID)(APP_FID)

	register_activity(APP_FID)({
		name: "asdf",
		render_sidebar: div => {
			div.innerHTML = "Hey!"
		},
		render_workspace: div => {
			commands.emit<cmd.application.set_title>("application.set_title", "Hello, World!")

			div.innerHTML = "Hello, World!"
		},
		render_icon: span => {
			span.innerHTML = "H"
		},
		routes: ["/"],
		is_background: true,
	})

	const sidebar = document.querySelector("#sidebar") as HTMLDivElement
	const workspace = document.querySelector("#workspace") as HTMLDivElement
	const tray = document.querySelector("#status-bar_tray_activities") as HTMLDivElement

	init_timer_display()
	get_title(APP_FID)().cata({ Ok: init_title_display, Err: noop })

	tray_activities$.subscribe(activities => {
		for (const activity of activities) {
			const span = document.createElement("span")
			activity.render_icon!(span)
			tray.appendChild(span)
		}
	})

	get_current_activity(APP_FID)().cata({
		Ok: current_activity$ => {
			const activity_bar_element = document.querySelector("#activity-bar") as HTMLDivElement

			current_activity$
				.pipe(combineLatestWith(activity_bar_activities$))
				.pipe(map(([current, total]) => ({ current, total })))
				.subscribe(({ current, total }) => {
					for (const activity of total) {
						const span = document.createElement("span")
						const a = document.createElement("a")
						a.classList.add("decoration-none", "no-underline")
						a.href = activity.routes[0]
						a.appendChild(span)
						if (activity.name === current.unwrap()?.name) span.classList.add("text-pink-500")
						activity.render_icon!(span)
						activity_bar_element.appendChild(a)
					}
				})

			current_activity$.subscribe(activity_option => {
				activity_option.cata({
					Some: activity => {
						activity.render_workspace!(workspace)
						activity.render_sidebar!(sidebar)
						if (activity.render_icon) {
							activity.is_background
								? tray_activities$.next([...tray_activities$.getValue(), activity])
								: activity_bar_activities$.next([...activity_bar_activities$.getValue(), activity])
						}
					},
					None: noop,
				})
			})
		},
		Err: noop,
	})

	set_current_activity(APP_FID)("asdf")

	Split(["#workspace", "#sidebar"], {
		minSize: 0,
		maxSize: window.innerWidth,
		sizes: [80, 20],
		snapOffset: window.innerWidth * 0.2,
		dragInterval: window.innerWidth * 0.05,
		onDrag: sizes => {
			Switch.OfTrue()
				.case(sizes[0] < 20, () => workspace.classList.replace("opacity-100", "opacity-0"))
				.case(sizes[0] > 20, () => workspace.classList.replace("opacity-0", "opacity-100"))
				.default(noop)

			Switch.OfTrue()
				.case(sizes[1] < 20, () => sidebar.classList.replace("opacity-100", "opacity-0"))
				.case(sizes[1] > 20, () => sidebar.classList.replace("opacity-0", "opacity-100"))
				.default(noop)
		},
	})
}

// --- Internal ---

const tray_activities$ = new BehaviorSubject<Functions.Activity[]>([])
const activity_bar_activities$ = new BehaviorSubject<Functions.Activity[]>([])

const init_timer_display = () => {
	const time = document.querySelector("#status-bar_tray_time") as HTMLDivElement

	const render_time = () => {
		const date = new Date(Date.now())

		const hours = date.getHours()
		const minutes = date.getMinutes()

		time.innerText = `${hours}:${minutes}`
	}

	render_time()

	timer(1_000).subscribe(render_time)
}

const init_title_display = (title$: Observable<string>) => {
	const title_element = document.querySelector("title") as HTMLTitleElement
	const status_bar_title_element = document.querySelector("#status-bar_title") as HTMLDivElement

	title$.subscribe(value => {
		title_element.innerText = `${value} | Ordo.pink`
		status_bar_title_element.innerText = value
	})
}

main()

// --- Deprecated ---

// import { createRoot } from "react-dom/client"

// import { type THosts, type TOrdoContext } from "@ordo-pink/core"
// import { __init_activities$, current_fid$ } from "@ordo-pink/frontend-stream-activities"
// import { ConsoleLogger } from "@ordo-pink/logger"
// import { __init_achievements$ } from "@ordo-pink/frontend-stream-achievements"
// import { __init_auth$ } from "@ordo-pink/frontend-stream-user"
// import { __init_command_palette$ } from "@ordo-pink/frontend-stream-command-palette"
// import { __init_commands } from "@ordo-pink/frontend-stream-commands"
// import { __init_fetch } from "@ordo-pink/frontend-fetch"
// import { __init_file_associations$ } from "@ordo-pink/frontend-stream-file-associations"
// import { __init_hosts } from "@ordo-pink/frontend-react-hooks"
// import { __init_logger } from "@ordo-pink/frontend-logger"
// import { __init_metadata$ } from "@ordo-pink/frontend-stream-data/src/frontend-stream-metadata.impl"
// import { __init_router$ } from "@ordo-pink/frontend-stream-router"
// import { __init_sidebar$ } from "@ordo-pink/frontend-stream-sidebar"
// import { __init_title$ } from "@ordo-pink/frontend-stream-title"
// import { __init_user$ } from "@ordo-pink/frontend-stream-user"

// import { APP_FID, isDev as is_dev } from "./constants"

// import App from "./app"

// current_fid$.next(APP_FID) // TODO: __init_current_fid$

// const LOGGER = ConsoleLogger

// const HOSTS: THosts = {
// 	id: import.meta.env.VITE_ORDO_ID_HOST,
// 	website: import.meta.env.VITE_ORDO_WEBSITE_HOST,
// 	static: import.meta.env.VITE_ORDO_STATIC_HOST,
// 	dt: import.meta.env.VITE_ORDO_DT_HOST,
// 	my: import.meta.env.VITE_ORDO_WORKSPACE_HOST,
// }

// const main = () => {
// 	const { fetch, get_fetch } = __init_fetch()
// 	const { hosts, get_hosts } = __init_hosts(HOSTS)
// 	const { logger, get_logger } = __init_logger(LOGGER)
// 	const { commands, get_commands } = __init_commands(APP_FID, logger)

// 	const { auth$, get_is_authenticated } = __init_auth$({ fetch, hosts, logger, is_dev })
// 	const { user_query } = __init_user$({ auth$, commands, fetch, hosts, logger })

// 	const { metadata_query, metadata_command } = __init_metadata$({
// 		auth$,
// 		commands,
// 		hosts,
// 		logger,
// 		user_query,
// 	})

// 	__init_router$(APP_FID)
// 	__init_command_palette$(APP_FID)
// 	__init_sidebar$(APP_FID)
// 	const { title$ } = __init_title$(logger, commands)

// 	__init_achievements$({ fid: APP_FID, dataCommands })
// 	__init_activities$(APP_FID)
// 	__init_file_associations$(APP_FID)

// 	const app_context: TOrdoContext = {
// 		queries: {
// 			metadata_query,
// 			user_query,
// 		},
// 		streams: {
// 			title$,
// 		},
// 		commands: {
// 			metadata_command,
// 		},
// 		get_fetch,
// 		get_hosts,
// 		get_logger,
// 		get_commands,
// 		get_is_authenticated,
// 	}

// 	const container = document.getElementById("root")!
// 	const root = createRoot(container)

// 	root.render(<App app_context={app_context} />)
// }

// main()
