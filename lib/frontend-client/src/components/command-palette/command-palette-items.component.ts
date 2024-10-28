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

import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { CommandPaletteItem } from "./command-palette-item.component"
import { CurrentItemLocation } from "./constants"

export const CommandPaletteItems = (
	items$: Observable<Ordo.CommandPalette.Item[]>,
	index$: Observable<number>,
	location$: Observable<CurrentItemLocation>,
	assigned_location: CurrentItemLocation,
) =>
	Maoka.create("div", ({ use }) => {
		const get_items = use(MaokaOrdo.Jabs.from$(items$, []))
		const get_current_selection = use(MaokaOrdo.Jabs.from$(index$, 0))
		const get_location = use(MaokaOrdo.Jabs.from$(location$, CurrentItemLocation.SUGGESTED))

		use(MaokaJabs.set_class("command-palette_items"))

		return () => {
			const current_selection = get_current_selection()
			const items = get_items()
			const location = get_location()

			return items.map((item, index) =>
				CommandPaletteItem(item, location === assigned_location && current_selection === index),
			)
		}
	})
