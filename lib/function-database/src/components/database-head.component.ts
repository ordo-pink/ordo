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

import { Maoka, TMaokaElement } from "@ordo-pink/maoka"
import { BsCaretDown } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { SortingDirection } from "../database.constants"
import { type TDatabaseState } from "../database.types"

export const DatabaseHead = (
	keys: Ordo.I18N.TranslationKey[],
	state: TDatabaseState,
	on_state_change: (new_state: TDatabaseState) => void,
) => thead(() => tr(() => keys.map(key => th(key, state, on_state_change))))

const thead = Maoka.styled("thead")
const tr = Maoka.styled("tr", { class: "database_table-head_row" })

const th = (key: Ordo.I18N.TranslationKey, state: TDatabaseState, on_state_change: (new_state: TDatabaseState) => void) =>
	Maoka.create("th", ({ use }) => {
		use(MaokaJabs.add_class("database_table-head_cell"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const { t } = use(MaokaOrdo.Jabs.Translations)

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()

			if (!state.sorting) state.sorting = {}

			state.sorting[key] =
				state.sorting[key] === SortingDirection.ASC
					? SortingDirection.DESC
					: state.sorting[key] === SortingDirection.DESC
						? undefined
						: SortingDirection.ASC

			on_state_change(state)
		}

		const t_key = t(key)

		return () =>
			CellContent(() => [
				t_key,
				state.sorting?.[key] === SortingDirection.ASC
					? (BsCaretDown() as TMaokaElement)
					: state.sorting?.[key] === SortingDirection.DESC
						? (BsCaretDown("rotate-180") as TMaokaElement)
						: void 0,
			])
	})

const CellContent = Maoka.styled("div", { class: "flex items-center justify-between" })
