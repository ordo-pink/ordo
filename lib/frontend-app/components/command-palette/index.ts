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

import { Hotkey, Input } from "@ordo-pink/maoka-components"
import { fuzzy_check, noop } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { Switch } from "@ordo-pink/switch"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { CurrentItemLocation } from "./constants"
import { OrdoCommandPaletteItems } from "./command-palette-items.component"

import "./command-palette.css"
import { BsMenuButtonWideFill } from "@ordo-pink/frontend-icons"

export const init_command_palette = () => {
	const commands = ordo_app_state.zags.select("commands")

	ordo_app_state.zags.update("sections", prev => ({ ...prev, command_palette: { current: EMPTY_COMMAND_PALETTE, global: [] } }))

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
		const current = ordo_app_state.zags.select("sections.command_palette.global")

		const command = current.find(item => item.hotkey && item.hotkey === hotkey)

		if (command) {
			event.preventDefault()
			event.stopPropagation()

			command.on_select()
		}
	}

	document.addEventListener("keydown", on_keydown)
}

// TODO Handle is_multiple
// TODO Handle on_new_item
// TODO Handle pinned_items
// TODO Handle alternative layout characters
const OrdoCommandPalette = Maoka.create("div", ({ use, on_unmount, after_mount }) => {
	use(MaokaJabs.set_class("command-palette"))

	let input = ""
	let visible_items = [] as Ordo.CommandPalette.Item[]
	let pinned_items = [] as Ordo.CommandPalette.Item[]
	let current_item_index = 0
	let current_item_location = CurrentItemLocation.SUGGESTED

	const commands = ordo_app_state.zags.select("commands")
	const t = ordo_app_state.zags.select("translate")

	const t_placeholder = t("t.common.components.command_palette.search_placeholder")

	const handle_click = (index: number, location: CurrentItemLocation) => {
		current_item_index = index
		current_item_location = location

		handle_enter()
	}

	const VisibleItems = OrdoCommandPaletteItems(
		() => visible_items,
		() => current_item_index,
		() => current_item_location,
		CurrentItemLocation.SUGGESTED,
		handle_click,
	)

	const PinnedItems = OrdoCommandPaletteItems(
		() => pinned_items,
		() => current_item_index,
		() => current_item_location,
		CurrentItemLocation.PINNED,
		handle_click,
	)

	const SearchInput = Input.Text({
		on_input: event => handle_input(event),
		custom_class: "command-palette_search",
		placeholder: t_placeholder,
		autofocus: true,
	})

	const refresh_components = () => {
		if (VisibleItems.refresh) void VisibleItems.refresh()
		if (PinnedItems.refresh) void PinnedItems.refresh()
	}

	const get_current_items = use(ordo_app_state.select_jab$("sections.command_palette.current"))

	const get_state = () => {
		const value = get_current_items()

		current_item_index = 0
		visible_items = value.max_items && value.max_items > 0 ? value.items.slice(0, value.max_items) : value.items

		if (VisibleItems.refresh) void VisibleItems.refresh()

		if (value.pinned_items) {
			pinned_items = value.pinned_items
			if (PinnedItems.refresh) void PinnedItems.refresh()
		}

		return value
	}

	const handle_keydown = (event: KeyboardEvent) =>
		Switch.Match(event.key)
			.case("ArrowUp", handle_arrow_up)
			.case("ArrowDown", handle_arrow_down)
			.case("Tab", () => handle_tab(event))
			.case("Enter", handle_enter)
			.default(noop)

	const handle_enter = () => {
		const state = get_state()
		const is_pinned = current_item_location === CurrentItemLocation.PINNED
		const source = is_pinned ? pinned_items : visible_items

		if (state.is_multiple) {
			if (state.on_new_item && input && !visible_items[current_item_index] && !is_pinned) {
				state.on_new_item?.(input)

				current_item_index = 0
			} else {
				source[current_item_index].on_select()

				if (is_pinned) {
					visible_items.push(pinned_items[current_item_index])
					pinned_items.splice(current_item_index, 1)
				} else {
					pinned_items.push(visible_items[current_item_index])
					visible_items.splice(current_item_index, 1)
				}

				current_item_index = 0
			}

			if (is_pinned && source.length === 0) current_item_location = CurrentItemLocation.SUGGESTED

			refresh_components()

			input = ""
			if (SearchInput.refresh) void SearchInput.refresh()
		} else {
			const invoke = source[current_item_index].on_select
			commands.emit("cmd.application.command_palette.hide")
			invoke()
		}
	}

	const handle_arrow_up = () => {
		const source = current_item_location === CurrentItemLocation.PINNED ? pinned_items : visible_items

		if (!source.length) return

		current_item_index = current_item_index === 0 ? source.length - 1 : current_item_index - 1

		refresh_components()
	}

	const handle_arrow_down = () => {
		const source = current_item_location === CurrentItemLocation.PINNED ? pinned_items : visible_items

		if (!source.length) return

		current_item_index = current_item_index === source.length - 1 ? 0 : current_item_index + 1

		refresh_components()
	}

	const handle_tab = (event: KeyboardEvent) => {
		event.preventDefault()

		const state = get_state()

		if (!state.is_multiple) return

		current_item_location =
			current_item_location === CurrentItemLocation.SUGGESTED ? CurrentItemLocation.PINNED : CurrentItemLocation.SUGGESTED

		current_item_index = 0

		refresh_components()
	}

	const handle_input = (event: Event) => {
		input = (event.target as HTMLInputElement)?.value
		const state = get_state()
		const all = state.items

		const source = input ? all.filter(item => fuzzy_check(t(item.readable_name), input, 1)) : all
		const length = state.max_items && state.max_items > 0 ? state.max_items : source.length

		visible_items = source.slice(0, length)
		current_item_index = 0

		refresh_components()
	}

	after_mount(() => document.addEventListener("keydown", handle_keydown))
	on_unmount(() => document.removeEventListener("keydown", handle_keydown))

	return () => {
		const state = get_state()

		return [
			SearchInput,

			ItemsWrapper(() => [state.is_multiple ? PinnedItems : void 0, VisibleItems]),

			state.is_multiple ? WithPinnedItemsHint : NoPinnedItemsHint,
		]
	}
})

// --- Internal ---

const Hint = Maoka.styled("div", { class: "command-palette_hint" })

const ItemsWrapper = Maoka.styled("div", { class: "grow overflow-auto" })

const DisplayHotkey = (key: string) => Hotkey(key, { smol: true, decoration_only: true })

const WithPinnedItemsHint = Hint(() => [
	DisplayHotkey("arrowup"),
	DisplayHotkey("arrowdown"),
	DisplayHotkey("tab"),
	DisplayHotkey("enter"),
	DisplayHotkey("escape"),
])

const NoPinnedItemsHint = Hint(() => [
	DisplayHotkey("arrowup"),
	DisplayHotkey("arrowdown"),
	DisplayHotkey("enter"),
	DisplayHotkey("escape"),
])

const EMPTY_COMMAND_PALETTE = { items: [] } as Ordo.CommandPalette.Instance

const handle_add = (item: Ordo.CommandPalette.Item) =>
	ordo_app_state.zags.update("sections.command_palette.global", is =>
		is.some(i => i.readable_name === item.readable_name) ? is : [...is, item],
	)

const handle_remove = (id: string) =>
	ordo_app_state.zags.update("sections.command_palette.global", items => items.filter(item => item.readable_name === id))

const handle_show = (state: Ordo.CommandPalette.Instance) => {
	const commands = ordo_app_state.zags.select("commands")

	// TODO Check if the bug with double calls is no longer applicable
	// commands.emit("cmd.application.modal.hide")

	ordo_app_state.zags.update("sections.command_palette.current", () => state)

	commands.emit("cmd.application.modal.show", {
		show_close_button: false,
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
			items: ordo_app_state.zags.select("sections.command_palette.global"),
		})
}
