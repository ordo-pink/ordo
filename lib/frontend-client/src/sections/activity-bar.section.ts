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

import { O, TOption } from "@ordo-pink/option"
import { TLogger } from "@ordo-pink/logger"
import { init_create_component } from "@ordo-pink/maoka"

export const init_activity_bar = (
	logger: TLogger,
	commands: Client.Commands.Commands,
	activities$: Observable<Functions.Activity[]>,
	current_activity$: Observable<TOption<Functions.Activity>>,
) => {
	logger.debug("🟡 Initialising activity bar...")

	const activity_bar_element = document.querySelector("#activity-bar") as HTMLDivElement
	const ActivityBar = init_view(commands, activities$, current_activity$)

	activity_bar_element.appendChild(ActivityBar())

	logger.debug("🟢 Initialised activity bar.")
}

// --- View ---

const init_view = (
	commands: Client.Commands.Commands,
	activities$: Observable<Functions.Activity[]>,
	current_activity$: Observable<TOption<Functions.Activity>>,
) => {
	const create = init_create_component({
		create_element: document.createElement.bind(document),
		create_text: document.createTextNode.bind(document),
	})

	const div = create("div")
	const a = create("a")

	let activities = [] as Functions.Activity[]
	let current_activity_option: TOption<Functions.Activity> = O.None()

	const activity_bar_activities$ = activities$.pipe(
		map(as => as.filter(a => !a.is_background && !!a.render_icon)),
	)

	const ActivityLink = (activity: Functions.Activity) => {
		const href = activity.default_route ?? activity.routes[0]

		return a(use => {
			const element = use.current_element()

			element.setAttribute("class", "decoration-none no-underline")
			element.setAttribute("href", href)

			element.onclick = event => {
				event.preventDefault()
				commands.emit("cmd.application.router.navigate", href)
			}

			const span = document.createElement("span")

			if (activity.name === current_activity_option.unwrap()?.name)
				span.setAttribute("class", "text-pink-500")

			activity.render_icon!(span)

			return span
		})
	}

	return div(use => {
		const element = use.current_element()
		use.on_mount(() => {
			activity_bar_activities$.pipe(combineLatestWith(current_activity$)).subscribe(([as, cao]) => {
				activities = as
				current_activity_option = cao

				use.refresh()
			})
		})

		element.setAttribute("class", "h-full flex flex-col space-y-4 items-center justify-center")
		element.oncontextmenu = event =>
			commands.emit("cmd.application.context_menu.show", { event: event as any })

		return activities.map(activity => ActivityLink(activity))
	})
}
