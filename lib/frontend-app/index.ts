/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ConsoleLogger } from "@ordo-pink/logger"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { OrdoActivityBar } from "./src/components/activity-bar/activity-bar.component"
import { OrdoBackgroundTaskIndicator } from "./src/components/background-task-indicator.component"
import { OrdoModal } from "./src/components/modal/modal.overlay"
import { OrdoNotifications } from "./src/components/notifications/notifications-list.component"
import { OrdoSidebar } from "./src/components/sidebar/sidebar.component"
import { OrdoWorkspace } from "./src/components/workspace.component"
import { init_command_palette } from "./src/components/command-palette"
import { init_commands } from "./src/frontend-app.commands"
import { init_content } from "./src/frontend-app.content"
import { init_fetch } from "./src/frontend-app.fetch"
import { init_functions } from "./src/frontend-app.functions"
import { init_i18n } from "./src/frontend-app.i18n"
import { init_known_functions } from "./src/frontend-app.known-functions"
import { init_logger } from "./src/frontend-app.logger"
import { init_metadata } from "./src/frontend-app.metadata"
import { init_router } from "./src/frontend-app.router"
import { init_title_display } from "./src/frontend-app.title"
import { ordo_app_state } from "./app.state"

// TODO Move fonts to assets
import "./index.css"

// const indexed_db = indexedDB.open("ordo.pink", 3)

// indexed_db.onupgradeneeded = () => {
// 	const db = indexed_db.result
// 	if (!db.objectStoreNames.contains("content")) {
// 		db.createObjectStore("content")
// 	}

// 	if (!db.objectStoreNames.contains("metadata")) {
// 		db.createObjectStore("metadata")
// 	}
// }

export const App = Maoka.create("div", ({ use, on_unmount }) => {
	use(MaokaJabs.set_class("app"))

	const { app_fid, app_fn, is_dev } = ordo_app_state.zags.select("constants")

	const known_functions = init_known_functions(app_fn)
	ordo_app_state.zags.update("known_functions", () => known_functions)

	const { get_logger } = init_logger(ConsoleLogger)
	const app_logger = get_logger(app_fid)
	ordo_app_state.zags.update("logger", () => app_logger)

	const { get_fetch } = init_fetch()

	const { get_commands } = init_commands()
	ordo_app_state.zags.update("commands", () => get_commands(app_fid))

	const { translate } = init_i18n()
	ordo_app_state.zags.update("translate", () => translate)

	const router$ = init_router()
	const divorce_router = router$.marry(({ current_route }) => {
		ordo_app_state.zags.update("current_route", () => current_route)

		const activities = ordo_app_state.zags.select("functions.activities")
		const current_activity = activities?.find(activity => activity.routes.some(route => route === current_route.pathname))

		// TODO dynamic routes support
		if (current_activity) ordo_app_state.zags.update("functions.current_activity", () => current_activity)
	})

	// TODO zags.affair for partial subscription under given path
	// TODO zags.consume(other_zags)
	const functions$ = init_functions()
	const divorce_functions = functions$.marry(state => {
		ordo_app_state.zags.update("functions", () => state)

		const current_route = ordo_app_state.zags.select("current_route")
		const current_activity = ordo_app_state.zags.select("functions.current_activity")

		if (!current_activity) {
			// TODO dynamic routes support
			const activity = state.activities.find(activity => activity.routes.some(route => route === current_route.pathname))
			if (activity) ordo_app_state.zags.update("functions.current_activity", () => activity)
		}
	})

	init_title_display()
	init_command_palette()

	const { get_content_query } = init_content()
	const app_get_content_query = get_content_query(app_fid)
	ordo_app_state.zags.update("queries.content", () => app_get_content_query)

	const { get_metadata_query } = init_metadata()
	const app_metadata_query = get_metadata_query(app_fid)
	ordo_app_state.zags.update("queries.metadata", () => app_metadata_query)

	const function_state_source = {
		get_commands,
		get_content_query,
		get_fetch,
		get_logger,
		get_metadata_query,
		get_user_query: () => null as any, // TODO Add user_query
		known_functions,
		translate,
	}

	// TODO Render user defined functions
	// TODO .catch
	if (is_dev) void import("@ordo-pink/function-test").then(({ default: f }) => f(function_state_source))

	on_unmount(() => {
		// TODO Uninstalling created functions
		divorce_functions()
		divorce_router()
	})

	// TODO Init user
	return () => [OrdoWorkspace, OrdoSidebar, OrdoModal, OrdoNotifications, OrdoActivityBar, OrdoBackgroundTaskIndicator]
})
