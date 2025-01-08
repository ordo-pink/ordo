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
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { DataManager } from "./src/frontend-app.data-manager"
import { OrdoActivityBar } from "./src/components/activity-bar/activity-bar.component"
import { OrdoBackgroundTaskIndicator } from "./src/components/background-task-indicator.component"
import { OrdoContextMenu } from "./src/components/context-menu/context-menu.component"
import { OrdoModal } from "./src/components/modal/modal.overlay"
import { OrdoNotifications } from "./src/components/notifications/notifications-list.component"
import { OrdoSidebar } from "./src/components/sidebar/sidebar.component"
import { OrdoWorkspace } from "./src/components/workspace.component"
import { init_command_palette } from "./src/components/command-palette"
import { init_commands } from "./src/frontend-app.commands"
import { init_content } from "./src/frontend-app.content"
import { init_context_menu } from "./src/components/context-menu"
import { init_fetch } from "./src/frontend-app.fetch"
import { init_functions } from "./src/frontend-app.functions"
import { init_i18n } from "./src/frontend-app.i18n"
import { init_known_functions } from "./src/frontend-app.known-functions"
import { init_logger } from "./src/frontend-app.logger"
import { init_metadata } from "./src/frontend-app.metadata"
import { init_router } from "./src/frontend-app.router"
import { init_title_display } from "./src/frontend-app.title"
import { init_user } from "./src/frontent-app.user"
import { ordo_app_state } from "./app.state"

// TODO Move fonts to assets
import "./index.css"
import { register_move_command } from "./src/commands/move.command"

export const App = Maoka.create("div", ({ use, on_unmount }) => {
	use(MaokaJabs.set_class("app"))

	const { is_dev, app_fid } = ordo_app_state.zags.select("constants")

	const known_functions = init_known_functions()
	const { get_logger } = init_logger(ConsoleLogger)
	const { get_fetch } = init_fetch()
	const { commands, get_commands } = init_commands()
	const { translate } = init_i18n()
	const { get_file_associations } = init_functions()
	const { get_router } = init_router()
	const { get_user_query } = init_user()
	const { content_repository, get_content_query } = init_content()
	const { metadata_repository, get_metadata_query } = init_metadata()

	const data_manager = DataManager.Of(metadata_repository, content_repository)
	void data_manager.start(state_change =>
		Switch.Match(state_change)
			.case("get-remote", () => commands.emit("cmd.application.background_task.start_loading"))
			.case("put-remote", () => commands.emit("cmd.application.background_task.start_saving"))
			.case(["get-remote-complete", "put-remote-complete"], () => commands.emit("cmd.application.background_task.reset_status"))
			.default(noop),
	)

	const function_state_source = {
		get_commands,
		get_content_query,
		get_fetch,
		get_logger,
		get_metadata_query,
		get_router,
		get_file_associations,
		get_user_query,
		known_functions,
		translate,
	}

	const app_state: Ordo.CreateFunction.State = {
		commands: get_commands(app_fid),
		content_query: get_content_query(app_fid),
		fetch: get_fetch(app_fid),
		file_associations$: get_file_associations(app_fid),
		logger: get_logger(app_fid),
		metadata_query: get_metadata_query(app_fid),
		router$: get_router(app_fid),
		translate,
		user_query: get_user_query(app_fid),
	}

	// TODO Move to jabs
	init_context_menu()
	init_title_display()
	init_command_palette()

	// TODO Move translations from file explorer
	const unregister_move_command = register_move_command(app_state)

	// TODO Render user defined functions
	// TODO .catch
	// TODO await for rendering landing to string
	void import("@ordo-pink/function-welcome")
		.then(({ default: f }) => f(function_state_source))
		.then(() => import("@ordo-pink/function-file-editor"))
		.then(({ default: f }) => f(function_state_source))
		.then(() => import("@ordo-pink/function-rich-text"))
		.then(({ default: f }) => f(function_state_source))
		.then(() => import("@ordo-pink/function-database"))
		.then(({ default: f }) => f(function_state_source))
		.then(() => {
			if (is_dev) return import("@ordo-pink/function-test").then(({ default: f }) => f(function_state_source))
		})

	// TODO Uninstalling created functions
	on_unmount(() => {
		data_manager.cancel()
		unregister_move_command()
	})

	// TODO Init user
	return () => {
		return [
			OrdoWorkspace,
			OrdoSidebar,
			OrdoModal,
			OrdoNotifications,
			OrdoContextMenu,
			OrdoActivityBar,
			OrdoBackgroundTaskIndicator,
		]
	}
})
