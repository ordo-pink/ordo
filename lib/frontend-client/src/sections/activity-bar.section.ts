// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Observable, combineLatestWith, map } from "rxjs"

import { TLogger } from "@ordo-pink/logger"
import { TOption } from "@ordo-pink/option"

export const init_activity_bar = (
	logger: TLogger,
	commands: Client.Commands.Commands,
	activities$: Observable<Functions.Activity[]>,
	current_activity$: Observable<TOption<Functions.Activity>>,
) => {
	logger.debug("🟡 Initialising activity bar...")

	const activity_bar_element = document.querySelector("#activity-bar") as HTMLDivElement
	activity_bar_element.oncontextmenu = event =>
		commands.emit<cmd.ctx_menu.show>("context-menu.show", { event: event as any })

	const activity_bar_activities$ = activities$.pipe(
		map(as => as.filter(a => !a.is_background && !!a.render_icon)),
	)

	activity_bar_activities$
		.pipe(combineLatestWith(current_activity$))
		.subscribe(([activities, current_activity_option]) => {
			activity_bar_element.innerHTML = ""

			for (const activity of activities) {
				const a = document.createElement("a")
				const span = document.createElement("span")
				const current_activity = current_activity_option.unwrap()

				a.classList.add("decoration-none", "no-underline")
				a.href = activity.default_route ?? activity.routes[0]
				a.onclick = event => {
					event.preventDefault()
					commands.emit<cmd.router.navigate>(
						"router.navigate",
						activity.default_route ?? activity.routes[0],
					)
				}
				a.appendChild(span)
				a.setAttribute("title", activity.name)

				if (activity.name === current_activity?.name) span.classList.add("text-pink-500")

				activity.render_icon!(span)

				activity_bar_element.appendChild(a)
			}
		})

	logger.debug("🟢 Initialised activity bar.")
}
