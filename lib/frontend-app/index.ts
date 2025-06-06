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

import { maoka, maoka_dom } from "@ordo-pink/maoka"

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

import type { Core, Logger } from "@ordo-pink/sdk-core"
import { LOCALE, create_i18n } from "@ordo-pink/i18n"
import type { Client } from "@ordo-pink/sdk-client"
import { context } from "@ordo-pink/sdk-maoka"
import { create_routary_browser } from "@ordo-pink/routary-browser"
import { hunt } from "@ordo-pink/hunt"

import { auth_jab } from "./src/auth"
import { create_command_palette_jab } from "./src/command-palette"
import { create_modal_jab } from "./src/modal"

import "./index.css"

export type AppOptions = {
	hosts: Core.Hosts
	local_persistence_strategy: null
	logger: Logger
}

export const app = maoka.create<AppOptions>("div", ({ hosts, logger, use }) => {
	const hunter = hunt.begin<Client.Preys>()
	const fetch = window.fetch // TODO Replace with patched fetch
	const rotor = create_routary_browser(window)
	const i18n = create_i18n<Pick<t, keyof t>>(LOCALE.ENGLISH)

	use(context.provide({ fetch, hosts: Object.freeze(hosts), hunter, logger, rotor$: rotor.$, i18n$: i18n.$ }))

	use(auth_jab)

	const modal = use(create_modal_jab)
	const command_palette = use(create_command_palette_jab)

	const handle_mount = () => {
		const release_add_translations = hunter.track("i18n.add_translations", ({ locale, values }) => i18n.add(locale, values))
		const release_set_locale = hunter.track("i18n.set_locale", locale => i18n.set_locale(locale))

		return () => {
			release_add_translations()
			release_set_locale()
		}
	}

	use(maoka_dom.jabs.onmount(handle_mount))

	return () => [modal(), command_palette()]
})
