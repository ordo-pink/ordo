/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Checkbox } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { type TColumnName } from "../database.types"
import { database$ } from "../database.state"

export const DatabaseColumnModalItem = (column: TColumnName) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("database_modal_columns_item"))

		const { t } = use(MaokaOrdo.Jabs.get_translations$)
		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_db_state = use(MaokaOrdo.Jabs.happy_marriage$(database$))

		return () => {
			const db_state = get_db_state()
			const active_columns = db_state.visible_columns ?? ["t.database.column_names.name", "t.database.column_names.labels"]
			const is_checkbox_checked = active_columns.includes(column)
			const handle_checkbox_change = () => commands.emit("cmd.database.toggle_column", column)

			const t_column_name = t(column as Ordo.I18N.TranslationKey)

			return [
				DatabaseColumnsModalSubtitle(() => t_column_name),
				Checkbox({ checked: is_checkbox_checked, on_change: handle_checkbox_change }),
			]
		}
	})

const DatabaseColumnsModalSubtitle = Maoka.styled("div")
