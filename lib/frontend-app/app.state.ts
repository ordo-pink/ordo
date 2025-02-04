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

import { MaokaZAGS } from "@ordo-pink/maoka-zags"
import { type TLogger } from "@ordo-pink/logger"

import { CommandPaletteLocation, EMPTY_COMMAND_PALETTE } from "./src/components/command-palette/constants"
import { create_route } from "./src/frontend-app.router"

// @ts-ignore
const is_dev = import.meta.env.DEV
const app_name = "pink.ordo.app" // TODO Take from env
const version = "v0.7.0" // TODO Take from env
const hosts = {} as Ordo.Hosts // TODO Take from env
const app_fid = Symbol.for(app_name)
const app_fn = { fid: app_fid, name: app_name, permissions: { commands: [], queries: [] } }

export const ordo_app_state = MaokaZAGS.Of<TOrdoState>({
	constants: { is_dev, app_name, version, app_fid, app_fn },
	hosts,
	commands: null as any, // Assigned after initialization
	router: { routes: {}, current_route: create_route(document.location.pathname, {}) }, // Assigned after initialization
	functions: { activities: [], file_assocs: [] },
	known_functions: null as any, // Assigned after initialization
	logger: null as any, // Assigned after initialization
	translate: null as any, // Assigned after initialization
	fetch: null as any, // Assigned after initialization
	queries: {
		content: null as any, // Assigned after initialization
		metadata: null as any, // Assigned after initialization
		user: null as any, // Assigned after initialization
	},
	sections: {
		context_menu: { items: [] },
		command_palette: {
			current: EMPTY_COMMAND_PALETTE,
			global_items: [],
			index: 0,
			location: CommandPaletteLocation.SUGGESTED,
			visible_items: null,
		},
	},
	auth: { token: null, user: null },
})

export type TOrdoState = {
	logger: TLogger
	commands: Ordo.Command.Commands
	known_functions: OrdoInternal.KnownFunctions
	hosts: Ordo.Hosts
	translate: Ordo.I18N.TranslateFn
	fetch: Ordo.Fetch
	router: TRouter
	constants: TConstants
	queries: TQueries
	functions: TFunctions
	sections: TSections
	auth: TAuth
}

type TAuth = { token: string | null; user: Ordo.User.Current.Instance | null }

type TRouter = { current_route: Ordo.Router.Route; routes: Record<string, string> }

type TAppName = "pink.ordo.app"

type TVersion = `v${string}.${string}.${string}`

type TConstants = {
	app_name: TAppName
	app_fid: symbol
	is_dev: boolean
	app_fn: OrdoInternal.KnownFunction
	version: TVersion
}

type TFunctions = {
	current_activity?: Ordo.Activity.Instance["name"]
	activities: Ordo.Activity.Instance[]
	current_file_assoc?: Ordo.FileAssociation.Instance["name"]
	file_assocs: Ordo.FileAssociation.Instance[]
}

type TCommandPaletteSection = {
	global_items: Ordo.CommandPalette.Item[]
	visible_items: Ordo.CommandPalette.Item[] | null
	current: Ordo.CommandPalette.Instance
	index: number
	location: CommandPaletteLocation
}

type TContextMenu = { items: Ordo.ContextMenu.Item[]; state?: Ordo.ContextMenu.Instance }

type TSections = {
	context_menu: TContextMenu
	command_palette: TCommandPaletteSection
	modal?: Ordo.Modal.Instance
}

type TQueries = { user: Ordo.User.Query; metadata: Ordo.Metadata.Query; content: Ordo.Content.Query }
