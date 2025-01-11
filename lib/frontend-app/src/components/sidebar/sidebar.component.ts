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

import { BsArrowLeft, BsLayoutSidebarInsetReverse } from "@ordo-pink/frontend-icons"
import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { ordo_app_state } from "../../../app.state"
import { sidebar$ } from "./sidebar.state"

// TODO Automatically close sidebar in mobile if something was clicked
export const OrdoSidebar = Maoka.create("aside", ({ use, on_unmount }) => {
	const commands = ordo_app_state.zags.select("commands")
	const get_sidebar = use(MaokaOrdo.Jabs.happy_marriage$(sidebar$))

	commands.on("cmd.application.sidebar.disable", handle_disable_sidebar)
	commands.on("cmd.application.sidebar.enable", handle_enable_sidebar)
	commands.on("cmd.application.sidebar.hide", handle_hide_sidebar)
	commands.on("cmd.application.sidebar.show", handle_show_sidebar)
	commands.on("cmd.application.sidebar.toggle", handle_toggle_sidebar)

	on_unmount(() => {
		commands.off("cmd.application.sidebar.disable", handle_disable_sidebar)
		commands.off("cmd.application.sidebar.enable", handle_enable_sidebar)
		commands.off("cmd.application.sidebar.hide", handle_hide_sidebar)
		commands.off("cmd.application.sidebar.show", handle_show_sidebar)
		commands.off("cmd.application.sidebar.toggle", handle_toggle_sidebar)
	})

	return () => {
		const { visible, enabled } = get_sidebar()

		return Switch.OfTrue()
			.case(visible && enabled, () => SidebarRenderer)
			.default(noop)
	}
})

export const OrdoSidebarButton = Maoka.create("button", ({ use }) => {
	const commands = ordo_app_state.zags.select("commands")
	const get_sidebar = use(MaokaOrdo.Jabs.happy_marriage$(sidebar$))
	const get_current_activity = use(ordo_app_state.select_jab$("functions.current_activity"))

	use(MaokaJabs.set_class("activity-bar_link activity-bar_icon"))
	use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.sidebar.toggle")))

	return () => {
		const activities = ordo_app_state.zags.select("functions.activities")

		const { visible, enabled } = get_sidebar()
		const current_activity_name = get_current_activity()
		const current_activity = activities.find(activity => activity.name === current_activity_name)

		if (current_activity && current_activity.render_sidebar) commands.emit("cmd.application.sidebar.enable")
		else commands.emit("cmd.application.sidebar.disable")

		const readable_name = "t.common.components.sidebar.toggle"

		commands.emit("cmd.application.command_palette.remove", readable_name)

		if (enabled) {
			commands.emit("cmd.application.command_palette.add", {
				on_select: () => commands.emit("cmd.application.sidebar.toggle"),
				hotkey: "mod+b",
				readable_name,
				render_icon: div => void div.appendChild(BsLayoutSidebarInsetReverse() as SVGSVGElement),
			})
		}

		return Switch.OfTrue()
			.case(enabled && visible, () => BsArrowLeft("rotate-180") as TMaokaElement)
			.case(enabled && !visible, () => BsLayoutSidebarInsetReverse() as TMaokaElement)
			.default(noop)
	}
})

// --- Internal ---

const SidebarRenderer = Maoka.create("div", ({ use, element }) => {
	use(MaokaJabs.set_class("sidebar"))

	const get_current_activity = use(ordo_app_state.select_jab$("functions.current_activity"))
	const get_activities = use(ordo_app_state.select_jab$("functions.activities"))

	return async () => {
		const current_activity_name = get_current_activity()
		const activities = get_activities()
		const current_activity = activities.find(activity => activity.name === current_activity_name)

		if (current_activity && current_activity.render_sidebar)
			await current_activity.render_sidebar(element as unknown as HTMLDivElement) // TODO 404
		else element.innerHTML = ""
	}
})

const handle_disable_sidebar = () => sidebar$.update("enabled", () => false)
const handle_enable_sidebar = () => sidebar$.update("enabled", () => true)
const handle_hide_sidebar = () => sidebar$.update("visible", () => false)
const handle_show_sidebar = () => sidebar$.update("visible", () => true)
const handle_toggle_sidebar = () => sidebar$.select("enabled") && sidebar$.update("visible", prev => !prev)
