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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { is_string } from "@ordo-pink/tau"

import { DatabaseOptions } from "./components/database-options.component"
import { DatabaseTableActionsRow } from "./components/database-table-actions-row.component"
import { DatabaseTableHead } from "./components/database-table-head.component"
import { DatabaseTableRow } from "./components/database-table-row.component"
import { SortingDirection } from "./database.constants"
import { type TDatabaseState } from "./database.types"
import { database$ } from "./database.state"
import { show_columns_jab } from "./jabs/show-columns-modal.jab"
import { show_filters_jab } from "./jabs/filter-modal.jab"

import "./database.css"

export const Database = (metadata: Ordo.Metadata.Instance, content: Ordo.Content.Instance | null, state?: TDatabaseState) => {
	const initial_state = state ? state : is_string(content) ? (JSON.parse(content) as TDatabaseState) : {}
	database$.replace(initial_state)

	return Maoka.create("div", ({ use, on_unmount }) => {
		const get_db_state = use(MaokaOrdo.Jabs.happy_marriage$(database$))

		const fsid = metadata.get_fsid()

		use(MaokaJabs.set_class("database_view"))
		use(show_filters_jab(metadata))
		use(show_columns_jab(metadata))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_children = use(MaokaOrdo.Jabs.Metadata.get_children$(fsid))

		const divorce = database$.marry(state => {
			commands.emit("cmd.content.set", { fsid, content_type: "database/ordo", content: JSON.stringify(state) })
		})

		on_unmount(divorce)

		return () => {
			const db_state = get_db_state()
			const keys: Ordo.I18N.TranslationKey[] = db_state.columns
				? (db_state.columns as Ordo.I18N.TranslationKey[])
				: ["t.database.column_names.name", "t.database.column_names.labels"]

			if (!keys.includes("t.database.column_names.name")) keys.unshift("t.database.column_names.name")

			return [
				DatabaseOptions,
				DatabaseTable(() => [
					DatabaseTableHead(keys),
					DatabaseTableBody(() => [
						...to_sorted_children(db_state, get_children()).map(child => DatabaseTableRow(keys, child)),
						DatabaseTableActionsRow(metadata),
					]),
				]),
			]
		}
	})
}

// --- Internal ---

const DatabaseTableBody = Maoka.styled("tbody")

const DatabaseTable = Maoka.styled("table", { class: "w-full border database_border-color h-full" })

const to_sorted_children = (db_state: TDatabaseState, children: Ordo.Metadata.Instance[]) => {
	let items = children

	Object.keys(db_state.sorting ?? {}).forEach(key => {
		const sorting_key = key as keyof typeof db_state.sorting

		if (db_state.sorting![key] == null) return

		items = items.toSorted((a, b) => {
			const x = db_state.sorting![sorting_key] === SortingDirection.ASC ? a : b
			const y = db_state.sorting![sorting_key] === SortingDirection.ASC ? b : a

			return Switch.Match(key)
				.case("t.database.column_names.name", () => x.get_name().localeCompare(y.get_name()))
				.case("t.database.column_names.created_at", () => (x.get_created_at() > y.get_created_at() ? -1 : 1))
				.case("t.database.column_names.labels", () => {
					const label_x = x.get_labels()[0]
					const label_y = y.get_labels()[0]

					if (label_x.color < label_y.color) return -1
					else if (label_x.color > label_y.color) return 1

					return label_x.name.localeCompare(label_y.name)
				})
				.default(() => 1)
		})
	})

	return items
}
