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

import { maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { bs_menu_button_wide_fill } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"

import { activity_bar_icon } from "../../activity-bar/components/activity-bar-icon.component"

export const command_palette_toggle = maoka.create("div", ({ use, node }) => {
	const { hunter } = use(client_maoka.context.consume)

	const render_icon = (span: HTMLSpanElement) => maoka_dom.render(span, bs_menu_button_wide_fill(), node.root.create_id)
	const is_current = false
	const readable_name = "command_palette_name"

	const handle_click = (event: MouseEvent) => {
		event.preventDefault()
		hunter.shoot("command_palette.toggle")
	}
	const handle_keydown = (event: KeyboardEvent) => {
		if (maoka_dom.guards.is_dom_node(node) && event.code === "Enter") {
			event.stopPropagation()
			hunter.shoot("command_palette.toggle")
		}
	}

	use(client_maoka.jabs.classes.set("activity-bar_link"))
	use(client_maoka.jabs.set_attribute("tabindex", "1"))
	use(client_maoka.jabs.listen("onclick", handle_click))
	use(client_maoka.jabs.listen("onkeydown", handle_keydown))

	return () => activity_bar_icon({ is_current, render_icon, readable_name })
})
