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
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

import { type TOrdoState, ordo_app_state } from "../../../app.state"
import { CommandPaletteLocation } from "./constants"
import { OrdoCommandPaletteItems } from "./command-palette-items.component"

export const OrdoCommandPalette = Maoka.create("div", ({ use, refresh: refresh, onunmount, onmount: on_mount }) => {
	use(MaokaJabs.set_class("command-palette"))

	let input = ""

	const commands = ordo_app_state.zags.select("commands")
	const t = ordo_app_state.zags.select("translate")

	const placeholder = t("t.common.components.command_palette.search_placeholder")
	const custom_class = "command-palette_search"
	const autofocus = true
	const handle_click = (index: number, location: CommandPaletteLocation) => {
		ordo_app_state.zags.update("sections.command_palette", cp => ({ ...cp, index, location }))
		handle_enter()
	}

	const handle_input = (event: Event) => {
		input = (event.target as HTMLInputElement)?.value
		const state = get_state()
		const all = state.items

		const source = input ? all.filter(item => fuzzy_check(t(item.readable_name), input, 1)) : all
		const length = state.max_items && state.max_items > 0 ? state.max_items : source.length

		ordo_app_state.zags.update("sections.command_palette", cp => ({ ...cp, index: 0, visible_items: source.slice(0, length) }))
	}

	const SearchInput = Input.Text({ on_input: handle_input, custom_class, placeholder, autofocus, transparent: true })
	const VisibleItems = OrdoCommandPaletteItems(CommandPaletteLocation.SUGGESTED, handle_click)
	const PinnedItems = OrdoCommandPaletteItems(CommandPaletteLocation.PINNED, handle_click)

	const handle_marry_ordo_state = (state: TOrdoState) => {
		if (!input && !state.sections.command_palette.visible_items && state.sections.command_palette.current.items.length) {
			ordo_app_state.zags.update("sections.command_palette.visible_items", () =>
				state.sections.command_palette.current.max_items && state.sections.command_palette.current.max_items > 0
					? state.sections.command_palette.current.items.slice(0, state.sections.command_palette.current.max_items)
					: state.sections.command_palette.current.items,
			)
		}

		return state.sections.command_palette.current
	}

	const get_state = use(MaokaOrdo.Jabs.happy_marriage$(ordo_app_state.zags, handle_marry_ordo_state))

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

		if (!visible) return

		const is_pinned = current_item_location === CommandPaletteLocation.PINNED
		const source = is_pinned ? pinned : visible

		if (state.on_new_item && input && !is_pinned && !visible[index]) {
			const new_item = state.on_new_item(input)

			ordo_app_state.zags.update("sections.command_palette", cp => ({
				...cp,
				index: 0,
				location: CommandPaletteLocation.SUGGESTED,
				current: {
					...cp.current,
					pinned_items: cp.current.pinned_items ? [new_item, ...cp.current.pinned_items] : [new_item],
				},
			}))

			state.on_select(new_item)

			return void refresh()
		}

		if (state.is_multiple) {
			if (!source[index] || !state.on_select || !state.on_deselect) return

			if (is_pinned) {
				ordo_app_state.zags.update("sections.command_palette", cp => {
					const pinned_items = cp.current.pinned_items!.toSpliced(index, 1)

					return {
						...cp,
						index: pinned_items.length ? cp.index : 0,
						location: pinned_items.length ? cp.location : CommandPaletteLocation.SUGGESTED,
						visible_items: [...cp.visible_items!, pinned[index]],
						current: { ...cp.current, pinned_items },
					}
				})

				state.on_deselect(source[index])
			} else {
				ordo_app_state.zags.update("sections.command_palette", cp => {
					const visible_items = cp.visible_items!.toSpliced(index, 1)

					return {
						...cp,
						index: visible_items.length ? cp.index : 0,
						location: visible_items.length ? cp.location : CommandPaletteLocation.PINNED,
						visible_items,
						current: {
							...cp.current,
							pinned_items: cp.current.pinned_items ? [visible[index], ...cp.current.pinned_items] : [visible[index]],
						},
					}
				})

				state.on_select(source[index])
			}

			input = ""

			if (SearchInput.refresh) void SearchInput.refresh()
		} else {
			if (!source[index] || !state.on_select) return
			const invoke = () => state.on_select(source[index])
			commands.emit("cmd.application.command_palette.hide")
			ordo_app_state.zags.update("sections.command_palette.index", () => 0)
			invoke()
		}
	}

	const handle_arrow_up = () => {
		const visible_items = ordo_app_state.zags.select("sections.command_palette.visible_items")
		if (!visible_items) return

		const current_item_index = ordo_app_state.zags.select("sections.command_palette.index")
		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")

		const pinned_items = ordo_app_state.zags.select("sections.command_palette.current.pinned_items")!
		const source = current_item_location === CommandPaletteLocation.PINNED ? pinned_items : visible_items

		if (!source.length) return

		ordo_app_state.zags.update("sections.command_palette.index", () =>
			current_item_index === 0 ? source.length - 1 : current_item_index - 1,
		)
	}

	const handle_arrow_down = () => {
		const visible_items = ordo_app_state.zags.select("sections.command_palette.visible_items")
		if (!visible_items) return

		const current_item_index = ordo_app_state.zags.select("sections.command_palette.index")
		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")
		const pinned_items = ordo_app_state.zags.select("sections.command_palette.current.pinned_items")!
		const source = current_item_location === CommandPaletteLocation.PINNED ? pinned_items : visible_items

		if (!source.length) return

		ordo_app_state.zags.update("sections.command_palette.index", () =>
			current_item_index === source.length - 1 ? 0 : current_item_index + 1,
		)
	}

	const handle_tab = (event: KeyboardEvent) => {
		const state = get_state()
		if (!state.is_multiple) return

		event.preventDefault()

		const current_item_location = ordo_app_state.zags.select("sections.command_palette.location")

		ordo_app_state.zags.update("sections.command_palette", cp => ({
			...cp,
			location:
				current_item_location === CommandPaletteLocation.SUGGESTED
					? CommandPaletteLocation.PINNED
					: CommandPaletteLocation.SUGGESTED,
			index: 0,
		}))
	}

	on_mount(() => document.addEventListener("keydown", handle_keydown))
	onunmount(() => document.removeEventListener("keydown", handle_keydown))

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
