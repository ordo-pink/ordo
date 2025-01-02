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

import { type Observable } from "rxjs"

import { Hotkey, Input } from "@ordo-pink/maoka-components"
import { fuzzy_check, noop } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

import { CommandPaletteItems } from "./command-palette-items.component"
import { CurrentItemLocation } from "./constants"

import "./command-palette.css"

// TODO Handle is_multiple
// TODO Handle on_new_item
// TODO Handle pinned_items
// TODO Handle alternative layout characters
export const CommandPalette = (cp$: Observable<Ordo.CommandPalette.Instance>, ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, on_unmount, after_mount }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("command-palette"))

		let input = ""
		let visible_items = [] as Ordo.CommandPalette.Item[]
		let pinned_items = [] as Ordo.CommandPalette.Item[]
		let current_item_index = 0
		let current_item_location = CurrentItemLocation.SUGGESTED

		const { emit } = use(MaokaOrdo.Jabs.Commands.get)
		const { t } = use(MaokaOrdo.Jabs.Translations$)

		const t_placeholder = t("t.common.components.command_palette.search_placeholder")

		const handle_click = (index: number, location: CurrentItemLocation) => {
			current_item_index = index
			current_item_location = location

			handle_enter()
		}

		const VisibleItems = CommandPaletteItems(
			() => visible_items,
			() => current_item_index,
			() => current_item_location,
			CurrentItemLocation.SUGGESTED,
			handle_click,
		)

		const PinnedItems = CommandPaletteItems(
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

		const get_state = use(
			MaokaOrdo.Jabs.from$(cp$, { items: [] }, value => {
				current_item_index = 0
				visible_items = value.max_items && value.max_items > 0 ? value.items.slice(0, value.max_items) : value.items

				if (VisibleItems.refresh) void VisibleItems.refresh()

				if (value.pinned_items) {
					pinned_items = value.pinned_items
					if (PinnedItems.refresh) void PinnedItems.refresh()
				}

				return value
			}),
		)

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
				emit("cmd.application.command_palette.hide")
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
