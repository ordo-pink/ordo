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

import { fuzzy_check, noop } from "@ordo-pink/tau"
import { Hotkey } from "@ordo-pink/maoka-components"
import { Input } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { Switch } from "@ordo-pink/switch"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { CommandPaletteLocation } from "./constants"
import { OrdoCommandPaletteItems } from "./command-palette-items.component"

// TODO Handle on_new_item
// TODO Handle alternative layout characters
export const OrdoCommandPalette = Maoka.create("div", ({ use, on_unmount, on_mount }) => {
	use(MaokaJabs.set_class("command-palette"))

	let input = ""

	const commands = ordo_app_state.zags.select("commands")
	const t = ordo_app_state.zags.select("translate")

	const placeholder = t("t.common.components.command_palette.search_placeholder")
	const custom_class = "command-palette_search"
	const autofocus = true
	const handle_click = (index: number, location: CommandPaletteLocation) => {
		ordo_app_state.zags.update("sections.command_palette.index", () => index)
		ordo_app_state.zags.update("sections.command_palette.location", () => location)

		handle_enter()
	}

	const handle_input = (event: Event) => {
		input = (event.target as HTMLInputElement)?.value
		const state = get_state()
		const all = state.items

		const source = input ? all.filter(item => fuzzy_check(t(item.readable_name), input, 1)) : all
		const length = state.max_items && state.max_items > 0 ? state.max_items : source.length

		ordo_app_state.zags.update("sections.command_palette.index", () => 0)
		ordo_app_state.zags.update("sections.command_palette.visible_items", () => source.slice(0, length))
	}

	const SearchInput = Input.Text({ on_input: handle_input, custom_class, placeholder, autofocus })
	const VisibleItems = OrdoCommandPaletteItems(CommandPaletteLocation.SUGGESTED, handle_click)
	const PinnedItems = OrdoCommandPaletteItems(CommandPaletteLocation.PINNED, handle_click)

	const get_state = () => {
		const value = ordo_app_state.zags.select("sections.command_palette.current")

		if (!input)
			ordo_app_state.zags.update("sections.command_palette.visible_items", () =>
				value.max_items && value.max_items > 0 ? value.items.slice(0, value.max_items) : value.items,
			)

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
		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")
		const index = ordo_app_state.zags.select("sections.command_palette.index")
		const visible = ordo_app_state.zags.select("sections.command_palette.visible_items")
		const pinned = ordo_app_state.zags.select("sections.command_palette.current.pinned_items")!

		const is_pinned = current_item_location === CommandPaletteLocation.PINNED
		const source = is_pinned ? pinned : visible

		if (state.is_multiple) {
			if (state.on_new_item && input && !visible[index] && !is_pinned) {
				state.on_new_item?.(input)

				ordo_app_state.zags.update("sections.command_palette.index", () => 0)
			} else {
				if (!source[index]) return

				source[index].on_select()

				if (is_pinned) {
					ordo_app_state.zags.update("sections.command_palette.visible_items", items => [...items, pinned[index]])
					ordo_app_state.zags.update("sections.command_palette.current.pinned_items", items => items!.toSpliced(index, 1))
				} else {
					ordo_app_state.zags.update("sections.command_palette.visible_items", items => items.toSpliced(index, 1))
					ordo_app_state.zags.update("sections.command_palette.current.pinned_items", items => [...items!, visible[index]])
				}

				ordo_app_state.zags.update("sections.command_palette.index", () => 0)
			}

			if (is_pinned && source.length === 0)
				ordo_app_state.zags.update("sections.command_palette.location", () => CommandPaletteLocation.SUGGESTED)

			input = ""

			if (SearchInput.refresh) void SearchInput.refresh()
		} else {
			if (!source[index]) return
			const invoke = source[index].on_select
			commands.emit("cmd.application.command_palette.hide")
			invoke()
		}

		ordo_app_state.zags.update("sections.command_palette.index", () => 0)
	}

	const handle_arrow_up = () => {
		const current_item_index = ordo_app_state.zags.select("sections.command_palette.index")
		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")
		const visible_items = ordo_app_state.zags.select("sections.command_palette.visible_items")
		const pinned_items = ordo_app_state.zags.select("sections.command_palette.current.pinned_items")!
		const source = current_item_location === CommandPaletteLocation.PINNED ? pinned_items : visible_items

		if (!source.length) return

		ordo_app_state.zags.update("sections.command_palette.index", () =>
			current_item_index === 0 ? source.length - 1 : current_item_index - 1,
		)
	}

	const handle_arrow_down = () => {
		const current_item_index = ordo_app_state.zags.select("sections.command_palette.index")
		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")
		const visible_items = ordo_app_state.zags.select("sections.command_palette.visible_items")
		const pinned_items = ordo_app_state.zags.select("sections.command_palette.current.pinned_items")!
		const source = current_item_location === CommandPaletteLocation.PINNED ? pinned_items : visible_items

		if (!source.length) return

		ordo_app_state.zags.update("sections.command_palette.index", () =>
			current_item_index === source.length - 1 ? 0 : current_item_index + 1,
		)
	}

	const handle_tab = (event: KeyboardEvent) => {
		event.preventDefault()

		const state = get_state()
		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")

		if (!state.is_multiple) return

		ordo_app_state.zags.update("sections.command_palette.location", () =>
			current_item_location === CommandPaletteLocation.SUGGESTED
				? CommandPaletteLocation.PINNED
				: CommandPaletteLocation.SUGGESTED,
		)

		ordo_app_state.zags.update("sections.command_palette.index", () => 0)
	}

	on_mount(() => document.addEventListener("keydown", handle_keydown))
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
