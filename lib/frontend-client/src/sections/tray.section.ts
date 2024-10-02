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

import { Observable, map } from "rxjs"

import { type TLogger } from "@ordo-pink/logger"

export const init_tray = (logger: TLogger, activities$: Observable<Ordo.Activity.Instance[]>) => {
	logger.debug("🟡 Initialising tray...")

	const tray_activities$ = activities$.pipe(
		map(as => as.filter(a => a.is_background && !!a.render_icon)),
	)

	const tray_element = document.querySelector("#status-bar_tray_activities") as HTMLDivElement

	tray_activities$.subscribe(activities => {
		tray_element.innerHTML = ""

		for (const activity of activities) {
			const span = document.createElement("span")

			span.classList.add("cursor-pointer")
			span.setAttribute("title", activity.name)
			span.innerHTML = ""

			activity.render_icon!(span)

			tray_element.appendChild(span)
		}
	})

	logger.debug("🟢 Initialised tray.")
}
