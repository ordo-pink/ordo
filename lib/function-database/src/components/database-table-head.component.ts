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

import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsCaretDown } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { SortingDirection } from "../database.constants"
import { database_context } from "../database.context"

export const DatabaseTableHead = (keys: Ordo.I18N.TranslationKey[]) =>
	TableHead(() => TableHeadRow(() => keys.map(key => TableHeadCell(key))))

// --- Internal ---

const TableHead = Maoka.styled("thead")
const TableHeadRow = Maoka.styled("tr", { class: "database_table-head_row" })

// TODO: Add icons
const TableHeadCell = (key: Ordo.I18N.TranslationKey) =>
	Maoka.create("th", ({ use }) => {
		const { get_db_state, on_db_state_change } = use(database_context.consume)

		use(MaokaJabs.add_class("database_table-head_cell"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const { t } = use(MaokaOrdo.Jabs.Translations)

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()

			const state = get_db_state()

			if (!state.sorting) state.sorting = {}

			state.sorting[key] =
				state.sorting[key] === SortingDirection.ASC
					? SortingDirection.DESC
					: state.sorting[key] === SortingDirection.DESC
						? undefined
						: SortingDirection.ASC

			on_db_state_change(state)
		}

		const t_key = t(key)

		return () =>
			DatabaseTableCellContent(() => {
				const state = get_db_state()

				return [
					t_key,
					state.sorting?.[key] === SortingDirection.ASC
						? (BsCaretDown() as TMaokaElement)
						: state.sorting?.[key] === SortingDirection.DESC
							? (BsCaretDown("rotate-180") as TMaokaElement)
							: void 0,
				]
			})
	})

const DatabaseTableCellContent = Maoka.styled("div", { class: "flex items-center justify-between" })
