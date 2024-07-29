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

import { BehaviorSubject, type Observable, combineLatestWith, interval, map, pairwise } from "rxjs"
import Split from "split.js"

import {
	BackgroundTaskStatus,
	type TEnabledSidebar,
	type TFIDAwareActivity,
	type TGetHostsFn,
	type THosts,
	type TTitleState,
} from "@ordo-pink/core"
import { Result, type TUnwrapOk } from "@ordo-pink/result"
import { init_auth, init_user } from "@ordo-pink/frontend-stream-user"
import { ConsoleLogger } from "@ordo-pink/logger"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { RRR } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { type TOption } from "@ordo-pink/option"
import { init_activities } from "@ordo-pink/frontend-stream-activities"
import { init_commands } from "@ordo-pink/frontend-stream-commands"
import { init_fetch } from "@ordo-pink/frontend-fetch"
import { init_fid } from "@ordo-pink/frontend-stream-fid"
import { init_logger } from "@ordo-pink/frontend-logger"
import { init_metadata } from "@ordo-pink/frontend-stream-data/src/frontend-stream-metadata.impl"
import { init_router } from "@ordo-pink/frontend-stream-router"
import { init_sidebar } from "@ordo-pink/frontend-stream-sidebar"
import { init_title } from "@ordo-pink/frontend-stream-title"
import { noop } from "@ordo-pink/tau"

import { APP_FID } from "./constants"

import "@ordo-pink/css/main.css"
import { init_i18n } from "@ordo-pink/frontend-stream-i18n"
import { init_modal } from "./sections/modal.section"

const main = () => {
	const logger = ConsoleLogger
	const { get_logger } = init_logger(logger)

	const is_dev = import.meta.env.DEV

	const hosts = {
		id: import.meta.env.VITE_ORDO_ID_HOST,
		website: import.meta.env.VITE_ORDO_WEBSITE_HOST,
		static: import.meta.env.VITE_ORDO_STATIC_HOST,
		dt: import.meta.env.VITE_ORDO_DT_HOST,
		my: import.meta.env.VITE_ORDO_WORKSPACE_HOST,
	}
	const { get_hosts } = init_hosts(hosts)

	const { get_commands } = init_commands({ logger })
	const commands = get_commands(APP_FID)()

	init_modal({ commands, logger })

	const { set_current_fid } = init_fid()
	set_current_fid(APP_FID)(APP_FID)

	const { get_sidebar } = init_sidebar({ commands, logger })

	const { get_activities, get_current_activity, set_current_activity } = init_activities({
		logger,
		commands,
	})

	type TActivities$ = Observable<TFIDAwareActivity[]>
	type TCurrentActivity$ = Observable<TOption<Functions.Activity>>
	const activities$ = get_activities(APP_FID)().unwrap() as TActivities$
	const current_activity$ = get_current_activity(APP_FID)().unwrap() as TCurrentActivity$
	const tray_activities$ = activities$.pipe(
		map(as => as.filter(a => a.is_background && !!a.render_icon)),
	)
	const activity_bar_activities$ = activities$.pipe(
		map(as => as.filter(a => !a.is_background && !!a.render_icon)),
	)

	const { get_fetch } = init_fetch({ logger })
	const fetch = get_fetch(APP_FID)()

	const { get_current_route } = init_router({
		app_fid: APP_FID,
		activities$,
		commands,
		logger,
		set_current_activity,
		set_current_fid,
	})

	const { get_title } = init_title(logger, commands)

	const { get_auth, get_is_authenticated } = init_auth({ fetch, hosts, logger, commands })
	const { get_translations } = init_i18n({ logger, commands })

	const auth_result = get_auth(APP_FID)()
	const auth$ = auth_result.unwrap() as TUnwrapOk<typeof auth_result>

	const EN_TRANSLATIONS: Record<keyof t.common, string> = {
		email: "Email",
		handle: "Handle",
		password: "Password",
		privacy_policy: "Privacy Policy",
		repeat_password: "Repeat Password",
		twitter_url: "https://x.com/ordo_pink",
		messenger_support_url: "https://t.me/ordo_pink",
		email_support: "support@ordo.pink",
		license: "License",
		contact_us: "Contact Us",
	}

	const RU_TRANSLATIONS: Record<keyof t.common, string> = {
		email: "Email",
		handle: "Имя пользователя",
		password: "Пароль",
		privacy_policy: "Политика конфиденциальности",
		repeat_password: "И ещё раз пароль",
		twitter_url: "https://x.com/ordo_pink",
		messenger_support_url: "https://t.me/ordo_pink_ru",
		email_support: "support@ordo.pink",
		license: "Лицензия",
		contact_us: "Написать нам",
	}

	auth$.subscribe(auth_option => {
		auth_option.cata({
			Some: noop,
			None: () => {
				void import("./functions/welcome")
					.then(module => module.default)
					.then(f =>
						f({
							get_commands,
							get_current_route,
							get_hosts,
							get_is_authenticated,
							get_logger,
							get_translations,
							get_fetch,
							metadata_query,
							user_query,
							is_dev,
						}),
					)
			},
		})
	})

	void import("./functions/auth")
		.then(module => module.default)
		.then(f =>
			f({
				get_commands,
				get_current_route,
				get_hosts,
				get_is_authenticated,
				get_logger,
				get_translations,
				get_fetch,
				metadata_query,
				user_query,
				is_dev,
			}),
		)
		.catch(logger.alert)

	const { user_query } = init_user({ auth$, commands, fetch, hosts, logger })
	const { metadata_query } = init_metadata({ logger, commands, user_query, auth$, hosts, fetch })

	user_query.current_user_version$.subscribe(() => {
		user_query.get_current().cata({
			Ok: logger.info,
			Err: noop,
		})
	})

	metadata_query.version$.subscribe(() => {
		metadata_query.get().cata({
			Ok: console.log,
			Err: noop,
		})
	})

	const sidebar_element = document.querySelector("#sidebar") as HTMLDivElement
	const workspace_element = document.querySelector("#workspace") as HTMLDivElement
	const tray_element = document.querySelector("#status-bar_tray_activities") as HTMLDivElement

	init_background_task_display(commands)
	init_timer_display()
	get_title(APP_FID)().cata({ Ok: init_title_display, Err: noop })

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

	current_activity$.pipe(pairwise()).subscribe(([prev, next]) => {
		if (!prev.is_none)
			prev.unwrap()!.on_unmount?.({ workspace: workspace_element, sidebar: sidebar_element })

		next.cata({
			Some: activity => {
				workspace_element.innerHTML = ""
				sidebar_element.innerHTML = ""

				activity.render_workspace!(workspace_element)

				if (activity.render_sidebar) {
					commands.emit<cmd.sidebar.enable>("sidebar.enable")
					activity.render_sidebar(sidebar_element)
				} else {
					commands.emit<cmd.sidebar.disable>("sidebar.disable")
				}
			},
			None: noop,
		})
	})

	activity_bar_activities$
		.pipe(combineLatestWith(current_activity$))
		.subscribe(([activities, current_activity_option]) => {
			const activity_bar_element = document.querySelector("#activity-bar") as HTMLDivElement
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

	let split: any

	const sidebar_result = get_sidebar(APP_FID)()

	sidebar_result.cata({
		Ok: sidebar$ =>
			sidebar$.subscribe(sidebar => {
				Switch.OfTrue()
					.case(sidebar.disabled && split, () => {
						split = split?.destroy?.()
						sidebar_element.innerHTML = ""
					})
					.case(!sidebar.disabled && !split, () => {
						split = Split(["#workspace", "#sidebar"], {
							minSize: 0,
							maxSize: window.innerWidth,
							sizes: (sidebar as TEnabledSidebar).sizes,
							snapOffset: window.innerWidth * 0.2,
							dragInterval: window.innerWidth * 0.05,
							onDrag: sizes => {
								Switch.OfTrue()
									.case(sizes[0] < 20, () =>
										workspace_element.classList.replace("opacity-100", "opacity-0"),
									)
									.case(sizes[0] > 20, () =>
										workspace_element.classList.replace("opacity-0", "opacity-100"),
									)
									.default(noop)

								Switch.OfTrue()
									.case(sizes[1] < 20, () =>
										sidebar_element.classList.replace("opacity-100", "opacity-0"),
									)
									.case(sizes[1] > 20, () =>
										sidebar_element.classList.replace("opacity-0", "opacity-100"),
									)
									.default(noop)
							},
							onDragEnd: sizes =>
								commands.emit<cmd.sidebar.set_size>("sidebar.set-size", [
									Math.round(sizes[0]),
									Math.round(sizes[1]),
								]),
						})
					})
					.case(!sidebar.disabled && !!split, () => {
						split.setSizes((sidebar as TEnabledSidebar).sizes)
					})
					.default(noop)
			}),
		Err: noop,
	})

	commands.emit<cmd.application.add_translations>("application.add_translations", {
		lang: "en",
		prefix: "common",
		translations: EN_TRANSLATIONS,
	})

	commands.emit<cmd.application.add_translations>("application.add_translations", {
		lang: "ru",
		prefix: "common",
		translations: RU_TRANSLATIONS,
	})
}

// --- Internal ---

const init_background_task_display = (commands: Client.Commands.Commands) => {
	const bg_task_element = document.querySelector("#background-task-indicator") as HTMLDivElement

	const bg_task$ = new BehaviorSubject<BackgroundTaskStatus>(BackgroundTaskStatus.NONE)

	commands.on<cmd.application.background_task.set_status>(
		"application.background_task.set_status",
		status => bg_task$.next(status),
	)
	commands.on<cmd.application.background_task.reset_status>(
		"application.background_task.reset_status",
		() => bg_task$.next(BackgroundTaskStatus.NONE),
	)
	commands.on<cmd.application.background_task.start_loading>(
		"application.background_task.start_loading",
		() => bg_task$.next(BackgroundTaskStatus.LOADING),
	)
	commands.on<cmd.application.background_task.start_saving>(
		"application.background_task.start_saving",
		() => bg_task$.next(BackgroundTaskStatus.SAVING),
	)

	bg_task$.subscribe(status =>
		Switch.Match(status)
			.case(BackgroundTaskStatus.LOADING, () => {
				bg_task_element.innerHTML = `<div class="animate-spin">
				<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
				<path d="M512 1024c-69.1 0-136.2-13.5-199.3-40.2C251.7 958 197 921 150 874c-47-47-84-101.7-109.8-162.7C13.5 648.2 0 581.1 0 512c0-19.9 16.1-36 36-36s36 16.1 36 36c0 59.4 11.6 117 34.6 171.3 22.2 52.4 53.9 99.5 94.3 139.9 40.4 40.4 87.5 72.2 139.9 94.3C395 940.4 452.6 952 512 952c59.4 0 117-11.6 171.3-34.6 52.4-22.2 99.5-53.9 139.9-94.3 40.4-40.4 72.2-87.5 94.3-139.9C940.4 629 952 571.4 952 512c0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.2C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3s-13.5 136.2-40.2 199.3C958 772.3 921 827 874 874c-47 47-101.8 83.9-162.7 109.7-63.1 26.8-130.2 40.3-199.3 40.3z"></path>
				</svg>
				</div>`
			})
			.case(BackgroundTaskStatus.SAVING, () => {
				bg_task_element.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
				<path d="M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"></path>
				</svg>`
			})
			.default(() => {
				bg_task_element.innerHTML = ""
			}),
	)
}

const init_timer_display = () => {
	const time = document.querySelector("#status-bar_tray_time") as HTMLDivElement

	const render_time = () => {
		const date = new Date(Date.now())

		const hours = String(date.getHours())
		const minutes = String(date.getMinutes())

		time.innerText = `${hours}:${minutes.length === 1 ? `0${minutes}` : minutes}`
	}

	render_time()

	interval(300).subscribe(render_time)
}

const init_title_display = (title$: Observable<TTitleState>) => {
	const title_element = document.querySelector("title") as HTMLTitleElement
	const status_bar_title_element = document.querySelector("#status-bar_title") as HTMLDivElement

	title$.subscribe(({ window_title, status_bar_title = window_title }) => {
		title_element.innerText = `${window_title} | Ordo.pink`
		status_bar_title_element.innerText = status_bar_title
	})
}

type TInitHostsFn = (hosts: THosts) => { get_hosts: TGetHostsFn }
export const init_hosts: TInitHostsFn = hosts => ({
	get_hosts: fid => () =>
		Result.If(KnownFunctions.check_permissions(fid, { queries: ["application.hosts"] }))
			.pipe(Result.ops.err_map(() => eperm(`get_hosts -> fid: ${String(fid)}`)))
			.pipe(Result.ops.map(() => hosts)),
})

const eperm = RRR.codes.eperm("Init hosts")

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
