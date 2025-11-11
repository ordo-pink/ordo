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

import { bs_search } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { create } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka/styled"

import { command_palette$ } from "../command-palette.state"

export const command_palette_search = create.create("label", ({ use }) => {
	use(client_maoka.jabs.classes.set("command-palette_search_wrapper"))

	return () => [bs_search({ classes: "" }), search()]
})

const search = maoka_styled.tags.input("command-palette_search", ({ use }) => {
	const t_search = "Search..." // TODO i18n

	const handle_mount = () => use(create.dom.jabs.hit_if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		command_palette$.update("search_value", () => target.value)
	}

	use(client_maoka.jabs.set_id("cp-input"))
	use(client_maoka.jabs.set_attribute("placeholder", t_search))
	use(client_maoka.jabs.set_attribute("autocomplete", "off"))
	use(client_maoka.jabs.set_attribute("value", command_palette$.select("search_value")))
	use(client_maoka.jabs.listen("oninput", handle_input))
	use(create.dom.jabs.onmount(handle_mount))
})
