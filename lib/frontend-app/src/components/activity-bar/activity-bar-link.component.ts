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

import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

import { activity_bar_icon } from "./activity-bar-icon.component"

type Args = Pick<Ordo.Activity.Instance, "default_route"> &
	Required<Pick<Ordo.Activity.Instance, "render_icon" | "routes" | "name">> & {
		current_activity_name?: Ordo.Activity.Instance["name"]
		on_click?: (event: MouseEvent) => void
	}
export const activity_bar_link = maoka.styled.a<Args>(
	"activity-bar_link",
	({ render_icon, default_route, routes, name, current_activity_name, on_click }, use) => {
		const url = default_route ?? routes[0]
		const commands = ordo_app_state.zags.select("commands")

		use(maoka_jabs.set_attribute("href", url))
		use(maoka_jabs.listen("onclick", event => handle_click(event)))

		const handle_click = on_click
			? on_click
			: (event: MouseEvent) => {
					event.preventDefault()
					commands.emit("cmd.application.router.navigate", { url })
				}

		return () => activity_bar_icon({ name, render_icon, current_activity_name })
	},
)
