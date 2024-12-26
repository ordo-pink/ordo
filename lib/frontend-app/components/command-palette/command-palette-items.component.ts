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

import { CommandPaletteLocation } from "./constants"
import { OrdoCommandPaletteItem } from "./command-palette-item.component"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

export const OrdoCommandPaletteItems = (
	assigned_location: CommandPaletteLocation,
	on_click: (index: number, location: CommandPaletteLocation) => void,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("command-palette_items"))

		const get_items = use(
			ordo_app_state.select_jab$(
				assigned_location === CommandPaletteLocation.PINNED
					? "sections.command_palette.current.pinned_items"
					: "sections.command_palette.visible_items",
			),
		)
		const get_current_index = use(ordo_app_state.select_jab$("sections.command_palette.index"))
		const get_current_location = use(ordo_app_state.select_jab$("sections.command_palette.location"))
		const get_new_item_handler = use(ordo_app_state.select_jab$("sections.command_palette.current.on_new_item"))

		return () => {
			const items = get_items()!
			const current_index = get_current_index()
			const current_location = get_current_location()
			const has_new_item_handler = !!get_new_item_handler()

			// TODO Translations
			if (!items.length && assigned_location === CommandPaletteLocation.SUGGESTED) {
				if (has_new_item_handler)
					return CreateNewItemHint(() => ["press", Hotkey("Enter", { smol: true, decoration_only: true }), "to create"])
				else return CreateNewItemHint(() => ["Nothing found :("])
			}

			return items.map((item, index) =>
				OrdoCommandPaletteItem(
					item,
					() => on_click(index, assigned_location),
					current_location === assigned_location && current_index === index,
				),
			)
		}
	})

const CreateNewItemHint = Maoka.styled("div", {
	class: "command-palette_create-new-item-hint",
})
