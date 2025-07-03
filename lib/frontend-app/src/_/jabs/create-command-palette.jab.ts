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

import { bs_menu_button_wide_fill } from "@ordo-pink/frontend-icons"
import { COMMAND_PALETTE_ITEM_TYPE } from "@ordo-pink/core"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TMaokaJab } from "@ordo-pink/maoka"
import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { CommandPaletteLocation, EMPTY_COMMAND_PALETTE } from "../_/components/command-palette/constants"
import { OrdoCommandPalette } from "../_/components/command-palette/command-palette.component"

export const create_command_palette: TMaokaJab = ({ use }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)

	commands.on("cmd.application.command_palette.show", handle_show)
	commands.on("cmd.application.command_palette.hide", handle_hide)
	commands.on("cmd.application.command_palette.add", handle_add)
	commands.on("cmd.application.command_palette.remove", handle_remove)
	commands.on("cmd.application.command_palette.toggle", handle_toggle)

	commands.emit("cmd.application.command_palette.add", {
		value: () => commands.emit("cmd.application.command_palette.toggle"),
		readable_name: "t.common.components.command_palette.reset",
		type: COMMAND_PALETTE_ITEM_TYPE.COMMON_ACTION,
		hotkey: "mod+shift+p",
		render_icon: bs_menu_button_wide_fill,
	})

	use(
		MaokaDOM.Jabs.onmount(() => {
			const handle_keydown = (event: KeyboardEvent) => {
				if (IGNORED_KEYS.includes(event.key)) return

				const hotkey = create_hotkey_from_event(event, false)
				const current = ordo_app_state.zags.select("sections.command_palette.global_items")

				const command = current.find(item => item.hotkey && item.hotkey === hotkey)

				if (command) {
					event.preventDefault()
					event.stopPropagation()

					command.value()
				}
			}

			document.addEventListener("keydown", handle_keydown)

			return () => {
				document.removeEventListener("keydown", handle_keydown)

				commands.off("cmd.application.command_palette.show", handle_show)
				commands.off("cmd.application.command_palette.hide", handle_hide)
				commands.off("cmd.application.command_palette.add", handle_add)
				commands.off("cmd.application.command_palette.remove", handle_remove)
				commands.off("cmd.application.command_palette.toggle", handle_toggle)

				commands.emit("cmd.application.command_palette.remove", "t.common.components.command_palette.reset")
			}
		}),
	)
}

// --- Internal ---

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const handle_add = (item: Ordo.CommandPalette.Item) =>
	ordo_app_state.zags.update("sections.command_palette.global_items", is =>
		is.some(i => i.readable_name === item.readable_name) ? is : [...is, item],
	)

const handle_remove = (id: string) =>
	ordo_app_state.zags.update("sections.command_palette.global_items", items => items.filter(item => item.readable_name !== id))

// TODO Add hash for back button to work
const handle_show = (state: Ordo.CommandPalette.Instance) => {
	const commands = ordo_app_state.zags.select("commands")

	// TODO Check if the bug with double calls is no longer applicable
	// commands.emit("cmd.application.modal.hide")

	ordo_app_state.zags.update("sections.command_palette.current", () => state)

	commands.emit("cmd.application.modal.show", {
		onunmount: () =>
			ordo_app_state.zags.update("sections.command_palette", cp => ({
				...cp,
				current: EMPTY_COMMAND_PALETTE,
				index: 0,
				location: CommandPaletteLocation.SUGGESTED,
				visible_items: null,
			})),
		render: () => OrdoCommandPalette,
	})
}

const handle_hide = () => {
	const commands = ordo_app_state.zags.select("commands")
	commands.emit("cmd.application.modal.hide")
}

const handle_toggle = () => {
	const commands = ordo_app_state.zags.select("commands")
	const current_state = ordo_app_state.zags.select("sections.command_palette.current")

	if (current_state.items.length > 0) commands.emit("cmd.application.command_palette.hide")
	else
		commands.emit("cmd.application.command_palette.show", {
			items: ordo_app_state.zags.select("sections.command_palette.global_items"),
			on_select: item => item.value(),
		})
}
