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

import { type Maoka, create } from "@ordo-pink/oss-maoka"
import { COMMAND_PALETTE } from "@ordo-pink/sdk-client"
import { LOCALE } from "@ordo-pink/oss-i18n"
import { bs_layout_sidebar_inset_reverse } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"

import { SIDEBAR } from "./workspace.constants"
import { sidebar } from "./components/sidebar.component"
import { sidebar$ } from "./workspace.state"
import { sidebar_toggle } from "./components/sidebar-activity-bar-toggle.component"
import { workspace } from "./components/workspace.component"

import "./workspace.styles.css"

export const create_sidebar_jab: Maoka.Jab<{
	sidebar: () => Maoka.Component
	sidebar_toggle: () => Maoka.Component
	workspace: () => Maoka.Component
}> = ({ use }) => {
	const { hunter } = use(client_maoka.context.consume)

	const handle_mount = () => {
		const release_disable = hunter.track("sidebar.disable", handle_disable_sidebar)
		const release_enable = hunter.track("sidebar.enable", handle_enable_sidebar)
		const release_hide = hunter.track("sidebar.hide", handle_hide_sidebar)
		const release_show = hunter.track("sidebar.show", handle_show_sidebar)
		const release_toggle = hunter.track("sidebar.toggle", handle_toggle_sidebar)

		hunter.shoot("command_palette.add", {
			id: SIDEBAR.TOGGLE_COMMAND_ID,
			value: () => hunter.shoot("sidebar.toggle"),
			hotkey: "mod+b",
			type: COMMAND_PALETTE.ITEM_TYPE.COMMON_ACTION,
			readable_name: "sidebar_commands_toggle_title",
			description: "sidebar_commands_toggle_description",
			render_icon: span => create.dom.render(span, bs_layout_sidebar_inset_reverse(), () => crypto.randomUUID()),
		})

		hunter.shoot("i18n.add_translations", {
			locale: LOCALE.ENGLISH,
			values: {
				sidebar_commands_hide_title: "Hide Sidebar",
				sidebar_commands_hide_description: "Hide sidebar away from the sight!",
				sidebar_commands_show_title: "Show Sidebar",
				sidebar_commands_show_description: "Show the annoying thing on the right. Why isn't it on the left tho?",
				sidebar_commands_toggle_title: "Toggle Sidebar",
				sidebar_commands_toggle_description: "Show or hide Sidebar depending on whether it is, well, hidden or shown.",
			},
		})

		// hunter.shoot("cmd.application.context_menu.add", {
		// 	command: "cmd.application.sidebar.hide",
		// 	readable_name: "t.common.components.sidebar.hide",
		// 	type: CONTEXT_MENU_ITEM_TYPE.UPDATE,
		// 	should_show: ({ event }) => MaokaDOM.is_maoka_dom_element(event.target) && !!event.target.closest(".sidebar"),
		// 	render_icon: () => bs_arrow_left("rotate-180"),
		// })

		return () => {
			release_disable()
			release_enable()
			release_hide()
			release_show()
			release_toggle()

			hunter.shoot("command_palette.remove", SIDEBAR.TOGGLE_COMMAND_ID)

			hunter.shoot("i18n.remove_translations", [
				"sidebar_commands_hide_description",
				"sidebar_commands_hide_title",
				"sidebar_commands_show_description",
				"sidebar_commands_show_title",
				"sidebar_commands_toggle_description",
				"sidebar_commands_toggle_title",
			])
		}
	}

	use(create.dom.jabs.onmount(handle_mount))

	return { sidebar, sidebar_toggle, workspace }
}

// --- Internal ---

const handle_disable_sidebar = () => sidebar$.update("enabled", () => false)
const handle_enable_sidebar = () => sidebar$.update("enabled", () => true)
const handle_hide_sidebar = () => sidebar$.update("visible", () => false)
const handle_show_sidebar = () => sidebar$.update("visible", () => true)
const handle_toggle_sidebar = () => void (sidebar$.select("enabled") && sidebar$.update("visible", prev => !prev))
