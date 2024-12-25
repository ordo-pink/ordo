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

import { Hotkey } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { CurrentItemLocation } from "./constants"
import { OrdoCommandPaletteItem } from "./command-palette-item.component"

export const OrdoCommandPaletteItems = (
	get_items: () => Ordo.CommandPalette.Item[],
	get_current_index: () => number,
	get_current_location: () => CurrentItemLocation,
	assigned_location: CurrentItemLocation,
	on_click: (index: number, location: CurrentItemLocation) => void,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("command-palette_items"))

		return () => {
			const items = get_items()
			const current_index = get_current_index()
			const location = get_current_location()

			// TODO Translations
			if (!items.length && assigned_location === CurrentItemLocation.SUGGESTED) {
				return CreateNewItemHint(() => ["press", Hotkey("Enter", { smol: true, decoration_only: true }), "to create"])
			}

			return items.map((item, index) =>
				OrdoCommandPaletteItem(
					item,
					() => on_click(index, assigned_location),
					location === assigned_location && current_index === index,
				),
			)
		}
	})

const CreateNewItemHint = Maoka.styled("div", {
	class: "action-list-item command-palette_create-new-item-hint",
})
