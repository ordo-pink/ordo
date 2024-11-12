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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { CommandPaletteItem } from "./command-palette-item.component"
import { CurrentItemLocation } from "./constants"

export const CommandPaletteItems = (
	get_items: () => Ordo.CommandPalette.Item[],
	get_current_index: () => number,
	get_current_location: () => CurrentItemLocation,
	assigned_location: CurrentItemLocation,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("command-palette_items"))

		return () => {
			const items = get_items()
			const current_index = get_current_index()
			const location = get_current_location()

			return items.map((item, index) =>
				CommandPaletteItem(item, location === assigned_location && current_index === index),
			)
		}
	})
