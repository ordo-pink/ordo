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

import { TCreateFunctionContext, type THosts } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"

import { init_activities } from "./components/activities"
import { init_activity_bar } from "./sections/activity-bar.section"
import { init_background_task_display } from "./sections/background-task-display.section"
import { init_command_palette } from "./sections/command-palette.section"
import { init_commands } from "./components/commands"
import { init_context_menu } from "./sections/context-menu.section"
import { init_fetch } from "./components/fetch"
import { init_hosts } from "./components/hosts"
import { init_i18n } from "./components/i18n"
import { init_known_functions } from "./components/known-functions"
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

const APP_NAME = "pink.ordo.app"
const APP_FID = Symbol.for(APP_NAME)
const APP_FN = { fid: APP_FID, name: APP_NAME, permissions: { commands: [], queries: [] } }

type P = { logger: TLogger; is_dev: boolean; hosts: THosts }
export const create_client = ({ logger, is_dev, hosts }: P) => {
	const known_functions = init_known_functions(APP_FN)
	const { get_logger } = init_logger({ logger, known_functions })
	const { get_hosts } = init_hosts({ logger, hosts, known_functions })
	const { fetch, get_fetch } = init_fetch({ logger, known_functions, APP_FID })
	const { commands, get_commands } = init_commands({
		logger,
		known_functions,
		APP_FID,
		is_dev,
	})
	const { get_translations } = init_i18n({ logger, commands })
	register_common_translations(logger, commands)

	const { activities$, current_activity$, set_current_activity } = init_activities({
		logger,
		known_functions,
		commands,
	})
	const { auth$, user_query, get_is_authenticated, get_user_query } = init_user({
		logger,
		known_functions,
		commands,
		fetch,
		hosts,
	})
	const { get_current_route } = init_router({
		activities$,
		APP_FID,
		commands,
		known_functions,
		logger,
		set_current_activity,
	})

	const { get_metadata_query } = init_metadata({
		logger,
		known_functions,
		commands,
		user_query,
		auth$,
		hosts,
		fetch,
	})

	const { get_sidebar } = init_workspace(logger, known_functions, commands, current_activity$)
	init_modal({ commands, logger })
	init_background_task_display(logger, commands)
	init_timer_display(logger)
	init_title_display(logger, commands)
	init_activity_bar(logger, commands, activities$, current_activity$)
	init_tray(logger, activities$)

	const internal_context: TCreateFunctionContext = {
		fid: APP_FID,
		is_dev,
		get_translations,
		get_commands: get_commands(APP_FID),
		get_logger: get_logger(APP_FID),
		get_current_route: get_current_route(APP_FID),
		get_hosts: get_hosts(APP_FID),
		get_is_authenticated: get_is_authenticated(APP_FID),
		get_fetch: get_fetch(APP_FID),
		get_sidebar: get_sidebar(APP_FID),
		get_metadata_query: get_metadata_query(APP_FID),
		get_user_query: get_user_query(APP_FID),
	}

	init_command_palette(logger, commands, internal_context)
	init_context_menu(logger, commands, internal_context)

	void import("@ordo-pink/function-welcome")
		.then(module => module.default)
		.then(f =>
			f({
				get_commands,
				get_current_route,
				get_hosts,
				get_is_authenticated,
				get_logger,
				get_translations,
				get_sidebar,
				get_fetch,
				get_metadata_query,
				get_user_query,
				is_dev,
				known_functions,
			}),
		)

	void import("@ordo-pink/function-auth")
		.then(module => module.default)
		.then(f =>
			f({
				get_commands,
				get_current_route,
				get_hosts,
				get_is_authenticated,
				get_logger,
				get_sidebar,
				get_translations,
				get_fetch,
				get_metadata_query,
				get_user_query,
				is_dev,
				known_functions,
			}),
		)
}

// --- Internal ---
