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

import { Logger } from "@ordo-pink/logger"
import { maoka } from "@ordo-pink/maoka"

// import { maoka_jabs } from "@ordo-pink/maoka-jabs"
// import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

// import { OrdoActivityBar } from "./src/components/activity-bar/activity-bar.component"
// import { OrdoBackgroundTaskIndicator } from "./src/components/background-task-indicator.component"
// import { OrdoContextMenu } from "./src/components/context-menu.component"
// import { OrdoModal } from "./src/components/modal/modal.overlay"
// import { OrdoNotifications } from "./src/components/notifications/notifications-list.component"
// import { OrdoSidebar } from "./src/components/sidebar/sidebar.component"
// import { OrdoTitleDisplay } from "./src/components/title.component"
// import { OrdoWorkspace } from "./src/components/workspace.component"
// import { ordo_app_state } from "./app.state"

// import { create_command_palette } from "./src/jabs/create-command-palette.jab"
// import { create_file_command } from "./src/jabs/commands/create-file.command"
// import { create_function_state } from "./src/jabs/create-function-state.jab"
// import { create_function_state_source } from "./src/jabs/create-function-state-source.jab"
// import { edit_file_labels_command } from "./src/jabs/commands/edit-file-labels.command"
// import { edit_file_links_command } from "./src/jabs/commands/edit-file-links.command"
// import { move_file_command } from "./src/jabs/commands/move-file.command"
// import { remove_file_command } from "./src/jabs/commands/remove-file.command"
// import { rename_file_command } from "./src/jabs/commands/rename-file.command"
// import { start_metadata_manager } from "./src/jabs/start-data-orchestrator.jab"

// TODO Move fonts to assets
import { hunt } from "@ordo-pink/hunt"

import { app_context } from "./app-context"
import { create_command_palette } from "./src/command-palette/command-palette.jab"

import "./index.css"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { maoka_styled } from "@ordo-pink/maoka/src/maoka-styled.impl"

export type AppOptions = {
	hosts: Ordo.Hosts
	local_persistence_strategy: null
	logger: Logger
}

// TODO Move translations from file explorer
export const app = ({ hosts, logger }: AppOptions) =>
	internal.app_element(use => {
		const hunter = hunt.begin<Ordo.Preys>()
		const fetch = null as any
		const translate = null as any
		use(app_context.provide({ fetch, hosts, hunter, logger, translate }))

		const command_palette = use(create_command_palette)
		// ordo_app_state.zags.update("hosts.id", () => id_host)
		// ordo_app_state.zags.update("hosts.dt", () => dt_host)
		// ordo_app_state.zags.update("hosts.pb", () => pb_host)
		// ordo_app_state.zags.update("hosts.au", () => au_host)

		// const { app_fid } = ordo_app_state.zags.select("constants")

		// const { repositories, source } = use(create_function_state_source)
		// const app_state = use(create_function_state(app_fid, source))

		// use(MaokaOrdo.Context.provide(app_state))

		// use(create_command_palette)
		// use(move_file_command)
		// use(remove_file_command)
		// use(create_file_command)
		// use(rename_file_command)
		// use(edit_file_labels_command)
		// use(edit_file_links_command)

		// use(start_metadata_manager(repositories))

		// TODO Render user defined functions
		// TODO .catch
		// void Promise.any([
		// 	import("./src/sections/welcome").then(({ default: f }) => f(source)),
		// 	import("./src/sections/file-editor").then(({ default: f }) => f(source)),
		// 	import("@ordo-pink/function-rte")
		// 		.then(({ default: f }) => f(source))
		// 		.then(() => import("@ordo-pink/function-database"))
		// 		.then(({ default: f }) => f(source))
		// 		.then(() => import("@ordo-pink/function-board"))
		// 		.then(({ default: f }) => f(source)),
		// ])

		// TODO Init user
		return () => [
			internal.command_palette_button,
			command_palette,
			// OrdoWorkspace,
			// OrdoSidebar,
			// OrdoModal,
			// OrdoNotifications,
			// OrdoContextMenu,
			// OrdoActivityBar,
			// OrdoBackgroundTaskIndicator,
			// OrdoTitleDisplay,
		]
	})

namespace internal {
	export const app_element = maoka_styled.div("app")

	export const command_palette_button = maoka.create("button", use => {
		const { hunter } = use(app_context.consume)
		use(maoka_jabs.listen("onclick", () => hunter.shoot("command_palette.show", void 0)))

		return () => "Show CP"
	})
}
