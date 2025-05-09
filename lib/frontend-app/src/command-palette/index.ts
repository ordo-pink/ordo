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

import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { COMMAND_PALETTE_ITEM_TYPE } from "@ordo-pink/core"
import { bs_terminal } from "@ordo-pink/frontend-icons"

import { COMMAND_PALETTE_SECTION } from "./command-palette.contants"
import { app_context } from "../../app-context"
import { command_palette$ } from "./command-palette.state"
import { modal } from "./components/modal.component"
import { overlay } from "./components/overlay.component"

import "./command-palette.style.css"

export const create_command_palette_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	use(internal.track_prey_jab)

	return () => overlay(() => modal())
}

namespace internal {
	export const track_prey_jab: Maoka.Jab = ({ use }) => {
		const { hunter } = use(app_context.consume)

		const handle_onmount = () => {
			const release_add = hunter.track("command_palette.add", guns.command_palette_add)
			const release_hide = hunter.track("command_palette.hide", guns.command_palette_hide)
			const release_remove = hunter.track("command_palette.remove", guns.command_palette_remove)
			const release_show = hunter.track("command_palette.show", guns.command_palette_show)
			const release_toggle = hunter.track("command_palette.toggle", guns.command_palette_toggle)

			hunter.shoot("command_palette.add", {
				id: COMMAND_PALETTE_TOGGLE_ID,
				readable_name: "Toggle command palette",
				value: () => hunter.shoot("command_palette.toggle"),
				hotkey: "mod+shift+p",
				description: "Show or hide command palette. Hides command palette if you can see this message.",
				type: COMMAND_PALETTE_ITEM_TYPE.MODAL_OPENER,
				render_icon: span => maoka_dom.render(span, bs_terminal({}), () => crypto.randomUUID()),
			})

			return () => {
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_TOGGLE_ID)

				release_add()
				release_hide()
				release_remove()
				release_show()
				release_toggle()
			}
		}

		use(maoka_dom.jabs.onmount(handle_onmount))
	}

	const COMMAND_PALETTE_TOGGLE_ID = "command_palette.toggle"

	const global_palette = (): Ordo.CommandPalette.Instance<() => void> => ({
		items: command_palette$.select("items"),
		on_select: item => item.value(),
	})

	namespace guns {
		export const command_palette_add: Ordo.GunFor<"command_palette.add"> = item =>
			command_palette$.update("items", items => (items.some(i => i.id === item.id) ? items : [...items, item]))

		export const command_palette_hide: Ordo.GunFor<"command_palette.hide"> = () => {
			command_palette$.each({
				current: () => void 0,
				index: () => 0,
				location: () => COMMAND_PALETTE_SECTION.ITEMS,
				search_value: () => "",
			})
			window.location.hash = ""
		}

		export const command_palette_remove: Ordo.GunFor<"command_palette.remove"> = id =>
			command_palette$.update("items", items => items.filter(i => i.id !== id))

		export const command_palette_show: Ordo.GunFor<"command_palette.show"> = new_current => {
			command_palette$.update("current", () => new_current ?? global_palette())
			window.location.hash = "command-palette"
		}

		export const command_palette_toggle: Ordo.GunFor<"command_palette.toggle"> = () => {
			command_palette$.update("current", current => {
				if (current) {
					window.location.hash = ""
					return
				}

				window.location.hash = "command-palette"
				return global_palette()
			})
		}
	}
}
