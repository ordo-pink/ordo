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

import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { ContextMenuItemType } from "@ordo-pink/core"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { DatabaseFilterModal } from "../components/database-filter-modal.component"
import { database_context } from "../database.context"
import { is_database_context_menu_payload } from "../database.constants"

export const show_filters_jab =
	(metadata: Ordo.Metadata.Instance): TMaokaJab =>
	({ use }) => {
		const commands = use(MaokaOrdo.Jabs.get_commands)
		const state = use(MaokaOrdo.Context.consume)
		const { get_db_state, on_db_state_change } = use(database_context.consume)

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.database.show_filter_modal",
			readable_name: "t.database.filter_modal.context_menu",
			should_show: is_database_context_menu_payload,
			payload_creator: () => ({ metadata, state: get_db_state() }),
			type: ContextMenuItemType.READ,
		})

		commands.on("cmd.database.show_filter_modal", () =>
			commands.emit("cmd.application.modal.show", {
				render: div =>
					Maoka.render_dom(
						div,
						MaokaOrdo.Components.WithState(state, () => DatabaseFilterModal(get_db_state(), on_db_state_change)),
					),
			}),
		)
	}
