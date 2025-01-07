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

import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { TDatabaseState } from "./database.types"

export const database_context = MaokaJabs.create_context<{
	get_db_state: () => TDatabaseState
	on_db_state_change: (new_state: TDatabaseState) => void
}>()

export const create_database_context = (
	initial_state: TDatabaseState,
	on_state_change: (new_state: TDatabaseState) => void,
) => {
	let db_state = initial_state

	return {
		get_db_state: () => db_state,
		on_db_state_change: (new_state: Partial<TDatabaseState>) => {
			db_state = { ...db_state, ...new_state }

			on_state_change(db_state)
		},
	}
}
