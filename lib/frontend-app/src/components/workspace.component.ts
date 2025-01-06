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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ordo_app_state } from "../../app.state"

export const OrdoWorkspace = Maoka.create("main", ({ use, element }) => {
	use(MaokaJabs.set_class("workspace"))

	const commands = ordo_app_state.zags.select("commands")
	const get_current_activity = use(ordo_app_state.select_jab$("functions.current_activity"))
	const get_activities = use(ordo_app_state.select_jab$("functions.activities"))

	return async () => {
		const current_activity_name = get_current_activity()
		const activities = get_activities()
		const current_activity = activities.find(activity => activity.name === current_activity_name)

		if (current_activity?.render_sidebar) commands.emit("cmd.application.sidebar.enable")
		else commands.emit("cmd.application.sidebar.disable")

		if (current_activity && current_activity.render_workspace)
			await current_activity.render_workspace(element as unknown as HTMLDivElement) // TODO 404
		else element.innerHTML = ""
	}
})
