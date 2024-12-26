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

import { CommandPaletteLocation } from "./components/command-palette/constants"
import { OrdoSidebarStatus } from "./components/sidebar/sidebar.constants"

export const ordo_app_state = MaokaZAGS.Of<TOrdoState>({} as any)

export type TOrdoState = {
	logger: TLogger
	commands: Ordo.Command.Commands
	known_functions: OrdoInternal.KnownFunctions
	hosts: Ordo.Hosts
	translate: Ordo.I18N.TranslateFn
	constants: {
		app_name: "pink.ordo.app"
		app_fid: symbol
		is_dev: boolean
		app_fn: OrdoInternal.KnownFunction
		version: `v${string}.${string}.${string}`
	}
	current_route: Ordo.Router.Route
	functions: {
		current_activity?: Ordo.Activity.Instance
		activities: OrdoInternal.TFIDAwareActivity[]
		current_file_assoc?: Ordo.FileAssociation.Instance
		file_assocs: Ordo.FileAssociation.Instance[]
	}
	sections: {
		sidebar: OrdoSidebarStatus
		command_palette: {
			global_items: Ordo.CommandPalette.Item[]
			visible_items: Ordo.CommandPalette.Item[]
			current: Ordo.CommandPalette.Instance
			index: number
			location: CommandPaletteLocation
		}
	}
}

// TODO Move to core
export type TFunctionState = {
	logger: TLogger
	fetch: Ordo.Fetch
	commands: Ordo.Command.Commands
	translate: Ordo.I18N.TranslateFn
	user_query: Ordo.User.Query
	metadata_query: Ordo.Metadata.Query
	content_query: Ordo.Metadata.Query
}
