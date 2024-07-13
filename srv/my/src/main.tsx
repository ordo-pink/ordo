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

import { createRoot } from "react-dom/client"

import { type THosts, type TOrdoContext } from "@ordo-pink/core"
import { __init_activities$, current_fid$ } from "@ordo-pink/frontend-stream-activities"
import { ConsoleLogger } from "@ordo-pink/logger"
import { DataCommands } from "@ordo-pink/data"
import { __initData } from "@ordo-pink/frontend-stream-data"
import { __init_achievements$ } from "@ordo-pink/frontend-stream-achievements"
import { __init_auth$ } from "@ordo-pink/frontend-stream-user"
import { __init_command_palette$ } from "@ordo-pink/frontend-stream-command-palette"
import { __init_commands } from "@ordo-pink/frontend-stream-commands"
import { __init_fetch } from "@ordo-pink/frontend-fetch"
import { __init_file_associations$ } from "@ordo-pink/frontend-stream-file-associations"
import { __init_hosts } from "@ordo-pink/frontend-react-hooks"
import { __init_logger } from "@ordo-pink/frontend-logger"
import { __init_metadata$ } from "@ordo-pink/frontend-stream-data/src/frontend-stream-metadata.impl"
import { __init_router$ } from "@ordo-pink/frontend-stream-router"
import { __init_sidebar$ } from "@ordo-pink/frontend-stream-sidebar"
import { __init_title$ } from "@ordo-pink/frontend-stream-title"
import { __init_user$ } from "@ordo-pink/frontend-stream-user"

import { APP_FID, isDev as is_dev } from "./constants"
import { ClientContentPersistenceStrategy } from "./persistence-strategies/content.persistence-strategy"
import { ClientDataPersistenceStrategy } from "./persistence-strategies/data.persistence-strategy"

import App from "./app"

current_fid$.next(APP_FID) // TODO: __init_current_fid$

const LOGGER = ConsoleLogger

const dataPersistenceStrategy = ClientDataPersistenceStrategy.of(APP_FID)
const contentPersistenceStrategy = ClientContentPersistenceStrategy.of(APP_FID)

const dataCommands = DataCommands.of({ dataPersistenceStrategy, contentPersistenceStrategy })

const HOSTS: THosts = {
	id: import.meta.env.VITE_ORDO_ID_HOST,
	website: import.meta.env.VITE_ORDO_WEBSITE_HOST,
	static: import.meta.env.VITE_ORDO_STATIC_HOST,
	dt: import.meta.env.VITE_ORDO_DT_HOST,
	my: import.meta.env.VITE_ORDO_WORKSPACE_HOST,
}

const main = () => {
	const { fetch, get_fetch } = __init_fetch()
	const { hosts, get_hosts } = __init_hosts(HOSTS)
	const { logger, get_logger } = __init_logger(LOGGER)
	const { commands, get_commands } = __init_commands(APP_FID, logger)

	const { auth$ } = __init_auth$({ fetch, hosts, logger, is_dev })
	__init_user$({ fid: APP_FID, id_host: hosts.id }) // TODO: user repos, user query, user commands

	__initData({ fid: APP_FID, dataCommands }) // TODO: Remove
	const { metadata_query } = __init_metadata$({ auth$, commands, hosts, logger }) // TODO: metadata commands

	__init_router$(APP_FID)
	__init_command_palette$(APP_FID)
	__init_sidebar$(APP_FID)
	const { title$ } = __init_title$(logger, commands)

	__init_achievements$({ fid: APP_FID, dataCommands })
	__init_activities$(APP_FID)
	__init_file_associations$(APP_FID)

	const app_context: TOrdoContext = {
		queries: {
			metadata_query,
		},
		streams: {
			title$,
		},
		commands: {},
		get_fetch,
		get_hosts,
		get_logger,
		get_commands,
	}

	const container = document.getElementById("root")!
	const root = createRoot(container)

	root.render(<App app_context={app_context} />)
}

main()
