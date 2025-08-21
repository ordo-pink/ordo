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

import { COMMAND_PALETTE } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { core } from "@ordo-pink/sdk-core"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka/styled"

import { command_palette$ } from "../command-palette.state"
import { command_palette_item } from "./item.component"

export const command_palette_items = maoka.create("div", ({ use }) => {
	const get_state = use(client_maoka.jabs.zags.marry$(command_palette$))

	use(client_maoka.jabs.classes.set("command-palette_items_multiple-wrapper"))

	return () => {
		const state = get_state()

		if (!state.current) return null

		const visible_items = state.current.items.filter(item =>
			core.fns.fuzzy_check(item.readable_name, state.search_value, COMMAND_PALETTE.FUZZY_CHECK_RATIO),
		)

		if (!visible_items.length) return nothing_found_div(() => `Nothing matches the search term "${state.search_value}"`)

		if (!state.current.is_multiple)
			return items(() => visible_items.map((item, index) => command_palette_item({ active: state.index === index, item })))

		return [
			items(() =>
				state.items.map((item, index) =>
					command_palette_item({ active: state.location === COMMAND_PALETTE.SECTION.ITEMS && state.index === index, item }),
				),
			),
			items(() =>
				state.current!.pinned_items?.map((item, index) =>
					command_palette_item({
						active: state.location === COMMAND_PALETTE.SECTION.PINNED_ITEMS && state.index === index,
						item,
					}),
				),
			),
		]
	}
})

// --- Internal ---

export const items = maoka_styled.div("command-palette_items")

export const nothing_found_div = maoka_styled.div("command-palette_items_nothing-found")
