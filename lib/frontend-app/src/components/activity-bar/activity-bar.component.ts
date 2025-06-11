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

import { bs_menu_button_wide_fill } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { activity_bar_icon } from "./activity-bar-icon.component"
import { activity_bar_link } from "./activity-bar-link.component"
import { sidebar_button } from "../sidebar/sidebar.component"

import "./activity-bar.css"

export const OrdoActivityBar = maoka.styled.div("activity-bar", use => {
	// use(MaokaJabs.listen("oncontextmenu", event => handle_context_menu(event)))

	const commands = ordo_app_state.zags.select("commands")
	const get_list = use(ordo_app_state.select_jab$("functions.activities"))
	const get_current = use(ordo_app_state.select_jab$("functions.current_activity"))

	// const handle_context_menu = (event: MouseEvent) => {
	// 	event.preventDefault()
	// 	commands.emit("cmd.application.context_menu.show", { event })
	// }

	return () => {
		const activities = get_list()
		const current_activity_name = get_current()

		return [
			Maoka.create("span", ({ use }) => {
				use(maoka_jabs.set_class("activity-bar_link"))
				use(
					maoka_jabs.listen("onclick", event => {
						event.preventDefault()
						event.stopPropagation()

						commands.emit("cmd.application.command_palette.toggle")
					}),
				)

				// TODO i18n
				return () => activity_bar_icon({ name: "Command Palette", render_icon: bs_menu_button_wide_fill })
			}),

			ActivityBarActivities(
				() => () =>
					activities.map(
						({ name, routes, default_route, render_icon }) =>
							render_icon && activity_bar_link({ current_activity_name, default_route, name, render_icon, routes }),
					),
			),

			sidebar_button,
		]
	}
})

const ActivityBarActivities = MaokaStyled.Tags.div("activity-bar_activities")
