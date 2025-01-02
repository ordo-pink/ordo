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
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { OrdoSidebarStatus } from "./sidebar.constants"
import { ordo_app_state } from "../../../app.state"

export const OrdoSidebar = Maoka.create("aside", ({ use, on_unmount }) => {
	const commands = ordo_app_state.zags.select("commands")
	const get_status = use(ordo_app_state.select_jab$("sections.sidebar.status"))

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
		const status = get_status()

		return Switch.Match(status)
			.case(OrdoSidebarStatus.VISIBLE, () => Sidebar)
			.case(OrdoSidebarStatus.HIDDEN, noop) // TODO Hidden enabled sidebar state
			.default(noop)
	}
})

export const OrdoSidebarButton = Maoka.create("button", ({ use }) => {
	const commands = ordo_app_state.zags.select("commands")
	const get_status = use(ordo_app_state.select_jab$("sections.sidebar.status"))

	let prev_status: OrdoSidebarStatus

	use(MaokaJabs.set_class("activity-bar_link activity-bar_icon"))
	use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.sidebar.toggle")))

	return () => {
		const status = get_status()
		const readable_name = "t.common.components.sidebar.toggle"

		if (status !== OrdoSidebarStatus.DISABLED) {
			if (prev_status === OrdoSidebarStatus.DISABLED) {
				prev_status = status
				commands.emit("cmd.application.command_palette.add", {
					on_select: () => commands.emit("cmd.application.sidebar.toggle"),
					hotkey: "mod+b",
					readable_name,
					render_icon: div => void div.appendChild(BsLayoutSidebarInsetReverse() as SVGSVGElement),
				})
			}
		} else {
			prev_status = status
			commands.emit("cmd.application.command_palette.remove", readable_name)
		}

		return Switch.Match(status)
			.case(OrdoSidebarStatus.VISIBLE, () => BsArrowLeft("rotate-180") as TMaokaElement)
			.case(OrdoSidebarStatus.HIDDEN, () => BsLayoutSidebarInsetReverse() as TMaokaElement)
			.default(noop)
	}
})

// --- Internal ---

const Sidebar = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("sidebar"))

	return () => ["Sidebar"]
})

const handle_disable_sidebar = () => ordo_app_state.zags.update("sections.sidebar.status", () => OrdoSidebarStatus.DISABLED)
const handle_enable_sidebar = () => ordo_app_state.zags.update("sections.sidebar.status", () => OrdoSidebarStatus.HIDDEN)
const handle_show_sidebar = () => ordo_app_state.zags.update("sections.sidebar.status", () => OrdoSidebarStatus.VISIBLE)
const handle_hide_sidebar = () => ordo_app_state.zags.update("sections.sidebar.status", () => OrdoSidebarStatus.HIDDEN)
const handle_toggle_sidebar = () =>
	ordo_app_state.zags.update("sections.sidebar.status", prev_status =>
		Switch.Match(prev_status)
			.case(OrdoSidebarStatus.VISIBLE, () => OrdoSidebarStatus.HIDDEN)
			.case(OrdoSidebarStatus.HIDDEN, () => OrdoSidebarStatus.VISIBLE)
			.default(() => OrdoSidebarStatus.DISABLED),
	)
