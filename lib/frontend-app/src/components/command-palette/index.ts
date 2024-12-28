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

import { BsMenuButtonWideFill } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { call_once } from "@ordo-pink/tau"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { EMPTY_COMMAND_PALETTE } from "./constants"
import { OrdoCommandPalette } from "./command-palette.component"

import "./command-palette.css"

export const init_command_palette = call_once(() => {
	const commands = ordo_app_state.zags.select("commands")

	commands.on("cmd.application.command_palette.show", handle_show)
	commands.on("cmd.application.command_palette.hide", handle_hide)
	commands.on("cmd.application.command_palette.add", handle_add)
	commands.on("cmd.application.command_palette.remove", handle_remove)
	commands.on("cmd.application.command_palette.toggle", handle_toggle)

	commands.emit("cmd.application.command_palette.add", {
		on_select: () => commands.emit("cmd.application.command_palette.toggle"),
		readable_name: "t.common.components.command_palette.reset",
		hotkey: "mod+shift+p",
		render_icon: div => void div.appendChild(BsMenuButtonWideFill() as SVGSVGElement),
	})

	const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

	const create_hotkey_string = (event: KeyboardEvent, is_darwin: boolean) => {
		let hotkey = ""

		if (event.altKey) hotkey += "meta+"
		if (event.ctrlKey) hotkey += is_darwin ? "ctrl+" : "mod+"
		if (event.metaKey) hotkey += "mod+"
		if (event.shiftKey) hotkey += "shift+"

		hotkey += event.key?.toLocaleLowerCase()

		return hotkey
	}

	const on_keydown = (event: KeyboardEvent) => {
		if (IGNORED_KEYS.includes(event.key)) return

		const hotkey = create_hotkey_string(event, false)
		const current = ordo_app_state.zags.select("sections.command_palette.global_items")

		const command = current.find(item => item.hotkey && item.hotkey === hotkey)

		if (command) {
			event.preventDefault()
			event.stopPropagation()

			command.on_select()
		}
	}

	document.addEventListener("keydown", on_keydown)
})

const handle_add = (item: Ordo.CommandPalette.Item) =>
	ordo_app_state.zags.update("sections.command_palette.global_items", is => [...is, item])

const handle_remove = (id: string) =>
	ordo_app_state.zags.update("sections.command_palette.global_items", items => items.filter(item => item.readable_name !== id))

const handle_show = (state: Ordo.CommandPalette.Instance) => {
	const commands = ordo_app_state.zags.select("commands")

	// TODO Check if the bug with double calls is no longer applicable
	// commands.emit("cmd.application.modal.hide")

	ordo_app_state.zags.update("sections.command_palette.current", () => state)

	commands.emit("cmd.application.modal.show", {
		on_unmount: () => ordo_app_state.zags.update("sections.command_palette.current", () => EMPTY_COMMAND_PALETTE),
		render: div => void Maoka.render_dom(div, OrdoCommandPalette),
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
		})
}
