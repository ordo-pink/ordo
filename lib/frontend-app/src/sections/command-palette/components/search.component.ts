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

import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_search } from "@ordo-pink/frontend-icons"

import { command_palette$ } from "../command-palette.state"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

export const command_palette_search = maoka.create("label", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("command-palette_search_wrapper"))

	return () => [bs_search({ classes: "" }), search()]
})

const search = maoka_styled.input("command-palette_search", ({ use }) => {
	const t_search = "Search..." // TODO i18n

	const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		command_palette$.update("search_value", () => target.value)
	}

	use(maoka_sdk.jabs.set_id("cp-input"))
	use(maoka_sdk.jabs.set_attribute("placeholder", t_search))
	use(maoka_sdk.jabs.set_attribute("autocomplete", "off"))
	use(maoka_sdk.jabs.set_attribute("value", command_palette$.select("search_value")))
	use(maoka_sdk.jabs.listen("oninput", handle_input))
	use(maoka_dom.jabs.onmount(handle_mount))
})
