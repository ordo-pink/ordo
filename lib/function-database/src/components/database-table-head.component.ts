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

import { BsCaretDown } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { SortingDirection } from "../database.constants"
import { database$ } from "../database.state"

export const DatabaseTableHead = (columns: Ordo.I18N.TranslationKey[]) =>
	TableHead(() => TableHeadRow(() => columns.map(TableHeadCell)))

// --- Internal ---

const TableHead = Maoka.styled("thead")
const TableHeadRow = Maoka.styled("tr", { class: "database_table-head_row" })

// TODO: Add icons
const TableHeadCell = (column: Ordo.I18N.TranslationKey) =>
	Maoka.create("th", ({ use }) => {
		const get_db_state = use(MaokaOrdo.Jabs.happy_marriage$(database$))

		use(MaokaJabs.add_class("database_table-head_cell"))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const { t } = use(MaokaOrdo.Jabs.get_translations$)
		const commands = use(MaokaOrdo.Jabs.get_commands)

		const handle_click = () => {
			commands.emit("cmd.database.toggle_sorting", column)
		}

		const t_column = t(column)

		return () =>
			DatabaseTableCellContent(() => {
				const state = get_db_state()
				const caret = Switch.Match(state.sorting?.[column])
					.case(SortingDirection.ASC, () => BsCaretDown())
					.case(SortingDirection.DESC, () => BsCaretDown("rotate-180"))
					.default(noop)

				return [t_column, caret]
			})
	})

const DatabaseTableCellContent = Maoka.styled("div", { class: "database_table-head_cell-content" })
