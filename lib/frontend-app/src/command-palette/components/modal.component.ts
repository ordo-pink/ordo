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

import { components, context } from "@ordo-pink/sdk-maoka"
import { maoka, maoka_styled } from "@ordo-pink/maoka"
import { bs_question_circle } from "@ordo-pink/frontend-icons"
import { client } from "@ordo-pink/sdk-client"
import { fuzzy_check } from "@ordo-pink/tau"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { COMMAND_PALETTE_SECTION, FUZZY_CHECK_RATIO } from "../command-palette.contants"
import { command_palette$ } from "../command-palette.state"
import { command_palette_items } from "./items.component"
import { command_palette_search } from "./search.component"

// TODO open via route fragment and query
// TODO create subitems if item is found with fuzzy search but the match is not exact
export const command_palette_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(context.consume)

	const is_darwin = use(maoka_jabs.is_darwin)
	const get_current = use(maoka_jabs.cheat$(command_palette$, "current" as const))

	const handle_click = (event: MouseEvent) => event.stopPropagation()
	const handle_global_keydown = (event: KeyboardEvent) => {
		if (internal.IGNORED_KEYS.includes(event.key)) return

		const current = get_current()

		if (current && event.code === "Escape") return void hunter.shoot("command_palette.hide")

		const parsed_hotkey = client.create_hotkey_from_event(event, is_darwin)

		if (current) {
			const filtered_items = current.items.filter(i =>
				fuzzy_check(i.readable_name, command_palette$.select("search_value"), FUZZY_CHECK_RATIO),
			)

			if (current.is_multiple && event.code === "Tab")
				return command_palette$.update("location", l =>
					l === COMMAND_PALETTE_SECTION.ITEMS ? COMMAND_PALETTE_SECTION.PINNED_ITEMS : COMMAND_PALETTE_SECTION.ITEMS,
				)
			else if (event.code === "ArrowDown") {
				event.preventDefault()
				return command_palette$.update("index", i => (i >= filtered_items.length - 1 ? 0 : i + 1))
			} else if (event.code === "ArrowUp") {
				event.preventDefault()
				return command_palette$.update("index", i => (i <= 0 ? filtered_items.length - 1 : i - 1))
			} else if (event.code === "Enter") {
				current.on_select(filtered_items[command_palette$.select("index")])
			}

			for (let i = 0; i < current.items.length; i++) {
				const item = current.items[i]

				if (parsed_hotkey === item.hotkey) {
					event.preventDefault()
					current.on_select(item)
					break
				}
			}
		} else {
			const global_items = command_palette$.select("items")

			for (let i = 0; i < global_items.length; i++) {
				const item = global_items[i]

				if (parsed_hotkey === item.hotkey) {
					event.preventDefault()
					item.value()
					break
				}
			}
		}
	}

	use(maoka_jabs.set_id("cp"))
	use(maoka_jabs.set_class("command-palette"))
	use(maoka_jabs.listen("onclick", handle_click))
	use(maoka_jabs.listen_global_event("keydown", handle_global_keydown))

	return () => {
		const current = get_current() ?? null

		return (
			current && [
				command_palette_search(),

				command_palette_items(),

				internal.footer(() => [
					bs_question_circle({ classes: "mr-2" }),
					internal.text_span(() => "Type to search. Arrows to navigate."),
					components.hotkey({ hotkey: "enter", decoration_only: true }),
					internal.text_span(() => "to select item."),
					components.hotkey({ hotkey: "escape", decoration_only: true }),
					internal.text_span(() => "to close."),
				]),
			]
		)
	}
})

namespace internal {
	export const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]
	export const text_span = maoka_styled.span()
	export const footer = maoka_styled.div("command-palette_footer")
}
