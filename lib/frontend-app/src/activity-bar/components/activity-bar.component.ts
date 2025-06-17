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

import { type Maoka, maoka, maoka_dom } from "@ordo-pink/maoka"
import { context, maoka_sdk } from "@ordo-pink/sdk-maoka"
import { type ClientSDK } from "@ordo-pink/sdk-client"
import { bs_menu_button_wide_fill } from "@ordo-pink/frontend-icons"

import { activity_bar_icon } from "./activity-bar-icon.component"
import { activity_bar_link } from "./activity-bar-link.component"
import { sidebar_toggle } from "../../sidebar/components/sidebar-activity-bar-toggle.component"

export const activity_bar = maoka.create<{ sidebar_toggle: Maoka.Component }>("div", ({ use }) => {
	const { activities$ } = use(maoka_sdk.context.consume)
	const get_state = use(maoka_sdk.jabs.zags.marry$(activities$))

	use(maoka_sdk.jabs.classes.set("activity-bar"))

	return () => {
		const { current, items } = get_state()

		return [
			command_palette_activity_bar_toggle(),
			activity_bar_activities(() => items.map(render_activity(current))),
			sidebar_toggle(),
		]
	}
})

const render_activity = (current: ClientSDK.Activity.Instance | null) => (item: ClientSDK.Activity.Instance) =>
	item.render_icon && activity_bar_link({ is_current: !!current && current.id === item.id, item })

const activity_bar_activities = maoka.create("div", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("activity-bar_activities"))
})

const command_palette_activity_bar_toggle = maoka.create("div", ({ use, node }) => {
	const { hunter } = use(context.consume)

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

	use(maoka_sdk.jabs.classes.set("activity-bar_link"))
	use(maoka_sdk.jabs.set_attribute("tabindex", "1"))
	use(maoka_sdk.jabs.listen("onclick", handle_click))
	use(maoka_sdk.jabs.listen("onkeydown", handle_keydown))

	return () => activity_bar_icon({ is_current, render_icon, readable_name })
})
