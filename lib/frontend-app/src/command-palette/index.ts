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

import { COMMAND_PALETTE, type ClientSDK } from "@ordo-pink/sdk-client"
import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { bs_menu_button_wide_fill } from "@ordo-pink/frontend-icons"
import { context } from "@ordo-pink/sdk-maoka"

import { COMMAND_PALETTE_SECTION, COMMAND_PALETTE_TOGGLE_COMMAND } from "./command-palette.contants"
import { command_palette$ } from "./command-palette.state"
import { command_palette_modal } from "./components/modal.component"
import { command_palette_overlay } from "./components/overlay.component"

import "./command-palette.styles.css"

export const create_command_palette_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	use(track_prey_jab)

	return () => command_palette_overlay(() => command_palette_modal())
}

// @internal

const track_prey_jab: Maoka.Jab = ({ use }) => {
	const { hunter } = use(context.consume)

	const handle_onmount = () => {
		const release_add = hunter.track("command_palette.add", command_palette_add)
		const release_hide = hunter.track("command_palette.hide", command_palette_hide)
		const release_remove = hunter.track("command_palette.remove", command_palette_remove)
		const release_show = hunter.track("command_palette.show", command_palette_show)
		const release_toggle = hunter.track("command_palette.toggle", command_palette_toggle)

		hunter.shoot("i18n.add_translations", {
			locale: "en",
			values: {
				command_palette_name: "Command Palette",
				command_palette_commands_toggle_description:
					"Show or hide command palette. If you read this, doing this will hide the palette.",
				command_palette_commands_toggle_name: "Toggle Command Palette",
			},
		})

		hunter.shoot("command_palette.add", {
			description: "command_palette_commands_toggle_description",
			hotkey: COMMAND_PALETTE_TOGGLE_COMMAND.HOTKEY,
			id: COMMAND_PALETTE_TOGGLE_COMMAND.ID,
			readable_name: "command_palette_commands_toggle_name",
			render_icon: span => maoka_dom.render(span, bs_menu_button_wide_fill(), () => crypto.randomUUID()),
			type: COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
			value: () => hunter.shoot("command_palette.toggle"),
		})

		return () => {
			hunter.shoot("command_palette.remove", COMMAND_PALETTE_TOGGLE_COMMAND.ID)

			release_add()
			release_hide()
			release_remove()
			release_show()
			release_toggle()
		}
	}

	use(maoka_dom.jabs.onmount(handle_onmount))
}

const global_palette = (): ClientSDK.CommandPalette.Instance<() => void> => ({
	items: command_palette$.select("items"),
	on_select: item => item.value(),
})

const command_palette_add: ClientSDK.GunFor<"command_palette.add"> = item =>
	command_palette$.update("items", items => (items.some(i => i.id === item.id) ? items : [...items, item]))

const command_palette_hide: ClientSDK.GunFor<"command_palette.hide"> = () => {
	command_palette$.each({
		current: () => void 0,
		index: () => 0,
		location: () => COMMAND_PALETTE_SECTION.ITEMS,
		search_value: () => "",
	})
}

const command_palette_remove: ClientSDK.GunFor<"command_palette.remove"> = id =>
	command_palette$.update("items", items => items.filter(i => i.id !== id))

const command_palette_show: ClientSDK.GunFor<"command_palette.show"> = new_current => {
	command_palette$.update("current", () => new_current ?? global_palette())
}

const command_palette_toggle: ClientSDK.GunFor<"command_palette.toggle"> = () => {
	command_palette$.update("current", current => {
		if (current) return
		return global_palette()
	})
}

declare global {
	interface t {
		command_palette: {
			name: string
			commands: {
				toggle: {
					name: string
					description: string
				}
			}
		}
	}
}
