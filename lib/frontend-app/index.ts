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
import { R } from "@ordo-pink/result"

import { OrdoActivityBar } from "./components/activity-bar/activity-bar.component"
import { OrdoBackgroundTaskIndicator } from "./components/background-task-indicator.component"
import { OrdoModal } from "./components/modal/modal.overlay"
import { OrdoNotifications } from "./components/notifications/notifications-list.component"
import { OrdoSidebar } from "./components/sidebar/sidebar.component"
import { OrdoWorkspace } from "./components/workspace.component"
import { init_command_palette } from "./components/command-palette"
import { init_commands } from "./src/frontend-app.commands"
import { init_functions } from "./src/frontend-app.functions"
import { init_hosts } from "./src/frontend-app.hosts"
import { init_i18n } from "./src/frontend-app.i18n"
import { init_known_functions } from "./src/frontend-app.known-functions"
import { init_logger } from "./src/frontend-app.logger"
import { init_router } from "./src/frontend-app.router"
import { init_title_display } from "./src/frontend-app.title"
import { ordo_app_state } from "./app.state"

// TODO Move fonts to assets
import "./index.css"

// const zags = MaokaZAGS.Of({ counter: { value: 0 } })

const is_dev = true // TODO Take from env
const app_name = "pink.ordo.app" // TODO Take from env
const version = "v0.7.0" // TODO Take from env
const app_fid = Symbol.for(app_name)
const app_fn = { fid: app_fid, name: app_name, permissions: { commands: [], queries: [] } }
const hosts = {} as Ordo.Hosts

// TODO Support for ignoring updates
ordo_app_state.zags.update("constants", () => ({ app_fid, app_fn, app_name, is_dev, version }))
ordo_app_state.zags.update("sections", () => ({ sidebar: 0 }) as any)

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

export const App = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("app"))

	const known_functions = init_known_functions(app_fn)
	ordo_app_state.zags.update("known_functions", () => known_functions)

	const { get_logger } = init_logger(ConsoleLogger)
	const get_app_logger = get_logger(app_fid)
	ordo_app_state.zags.update("logger", () => get_app_logger())

	const logger = ordo_app_state.zags.select("logger")
	const log_rrr = (rrr: Ordo.Rrr) => logger.panic("PERMISSION DENIED", rrr)

	const { get_commands } = init_commands()
	const get_app_commands = get_commands(app_fid)
	ordo_app_state.zags.update("commands", () => get_app_commands().cata(R.catas.expect(log_rrr)))

	const { get_hosts } = init_hosts(hosts)
	const get_app_hosts = get_hosts(app_fid)
	ordo_app_state.zags.update("hosts", () => get_app_hosts().cata(R.catas.expect(log_rrr)))

	const { translate } = init_i18n()
	ordo_app_state.zags.update("translate", () => translate)

	const router$ = init_router()
	router$.marry(({ current_route }) => ordo_app_state.zags.update("current_route", () => current_route))

	// TODO zags.consume(other_zags)
	const functions$ = init_functions()
	functions$.marry(state => ordo_app_state.zags.update("functions", () => state))

	init_title_display()
	init_command_palette()

	// TODO Init content
	// TODO Init metadata
	// TODO Adding functions

	// TODO ContextMenu, CommandPalette
	return () => [OrdoWorkspace, OrdoSidebar, OrdoModal, OrdoNotifications, OrdoActivityBar, OrdoBackgroundTaskIndicator]
})
