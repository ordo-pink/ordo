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

import "@ordo-pink/css/main.css"

import { type Observable } from "rxjs"

import { KnownFunctions, ORDO_PINK_APP_FUNCTION } from "@ordo-pink/frontend-known-functions"
import { type TFIDAwareActivity, type TGetHostsFn, type THosts } from "@ordo-pink/core"
import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { TLogger } from "@ordo-pink/logger"
import { type TOption } from "@ordo-pink/option"
import { noop } from "@ordo-pink/tau"

import { init_activities } from "./components/activities"
import { init_activity_bar } from "./sections/activity-bar.section"
import { init_background_task_display } from "./sections/background-task-display.section"
import { init_command_palette } from "./sections/command-palette.section"
import { init_commands } from "./components/commands"
import { init_fetch } from "./components/fetch"
import { init_fid } from "./components/fid"
import { init_i18n } from "./components/i18n"
import { init_logger } from "./components/logger"
import { init_metadata } from "./components/metadata"
import { init_modal } from "./sections/modal.section"
import { init_router } from "./components/router"
import { init_timer_display } from "./sections/timer.section"
import { init_title_display } from "./sections/title.section"
import { init_tray } from "./sections/tray.section"
import { init_user } from "./components/user"
import { init_workspace } from "./sections/workspace.section"
import { register_common_translations } from "./common-translations"

type P = {
	logger: TLogger
	is_dev: boolean
	hosts: THosts
}
export const create_client = ({ logger, is_dev, hosts }: P) => {
	const APP_FID = KnownFunctions.register(ORDO_PINK_APP_FUNCTION, {
		commands: [],
		queries: [],
	})!

	const { get_logger } = init_logger(logger)
	const { get_hosts } = init_hosts(hosts)
	const { get_commands } = init_commands({ logger })
	const commands = get_commands(APP_FID)()

	init_modal({ commands, logger })

	const { set_current_fid } = init_fid(logger)
	set_current_fid(APP_FID)(APP_FID)

	const { get_activities, get_current_activity, set_current_activity } = init_activities({
		logger,
		commands,
	})

	type TActivities$ = Observable<TFIDAwareActivity[]>
	type TCurrentActivity$ = Observable<TOption<Functions.Activity>>
	const activities$ = get_activities(APP_FID)().unwrap() as TActivities$
	const current_activity$ = get_current_activity(APP_FID)().unwrap() as TCurrentActivity$

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

	const { auth$, get_is_authenticated, user_query } = init_user({
		fetch,
		hosts,
		logger,
		commands,
	})
	const { get_translations } = init_i18n({ logger, commands })
	const { metadata_query } = init_metadata({ logger, commands, user_query, auth$, hosts, fetch })

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

	metadata_query.version$.subscribe(() => {
		metadata_query.get().cata({
			Ok: console.log,
			Err: noop,
		})
	})

	const context = {
		fid: APP_FID,
		is_dev,
		get_commands: get_commands(APP_FID),
		get_logger: get_logger(APP_FID),
		get_current_route: get_current_route(APP_FID),
		get_hosts: get_hosts(APP_FID),
		get_is_authenticated: get_is_authenticated(APP_FID),
		get_fetch: get_fetch(APP_FID),
		get_translations,
		metadata_query,
		user_query,
	}

	register_common_translations(logger, commands)
	init_background_task_display(logger, commands)
	init_command_palette(logger, commands, context)
	init_timer_display(logger)
	init_title_display(logger, commands)
	init_activity_bar(logger, commands, activities$, current_activity$)
	init_tray(logger, activities$)
	init_workspace(logger, commands, current_activity$)
}

// --- Internal ---

type TInitHostsFn = (hosts: THosts) => { get_hosts: TGetHostsFn }
export const init_hosts: TInitHostsFn = hosts => ({
	get_hosts: fid => () =>
		Result.If(KnownFunctions.check_permissions(fid, { queries: ["application.hosts"] }))
			.pipe(Result.ops.err_map(() => eperm(`get_hosts -> fid: ${String(fid)}`)))
			.pipe(Result.ops.map(() => hosts)),
})

const eperm = RRR.codes.eperm("Init hosts")

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
