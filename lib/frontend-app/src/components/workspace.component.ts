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

import { Maoka, TMaokaElement } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

import { ordo_app_state } from "../../app.state"
import { sidebar$ } from "./sidebar/sidebar.state"

export const OrdoWorkspace = Maoka.create("main", ({ use, element }) => {
	use(MaokaJabs.set_class("workspace"))

	return () => [WorkspaceRenderer, SidebarPaddingContractor(element)]
})

const SidebarPaddingContractor = (element: TMaokaElement) =>
	Maoka.create("div", ({ use }) => {
		const get_sidebar = use(MaokaOrdo.Jabs.happy_marriage$(sidebar$))

		return () => {
			const sidebar = get_sidebar()

			Switch.OfTrue()
				.case(sidebar.enabled && sidebar.visible, () => element.classList?.remove("no-sidebar"))
				.default(() => element.classList?.add("no-sidebar"))
		}
	})

const WorkspaceRenderer = Maoka.create("div", ({ use }) => {
	const get_current_activity = use(ordo_app_state.select_jab$("functions.current_activity"))
	const get_activities = use(ordo_app_state.select_jab$("functions.activities"))

	return async () => {
		const activities = get_activities()
		const current_activity_name = get_current_activity()
		const current_activity = activities.find(activity => activity.name === current_activity_name)

		if (!current_activity || !current_activity.render_workspace) return null // TODO 404
		return current_activity.render_workspace()
	}
})
