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

import { interval } from "rxjs"

import { type TLogger } from "@ordo-pink/logger"

export const init_timer_display = (logger: TLogger) => {
	logger.debug("🟡 Initialising timer...")

	const time = document.querySelector("#status-bar_tray_time") as HTMLDivElement

	const render_time = () => {
		const date = new Date(Date.now())

		const hours = String(date.getHours())
		const minutes = String(date.getMinutes())

		time.innerText = `${hours}:${minutes.length === 1 ? `0${minutes}` : minutes}`
	}

	render_time()

	interval(300).subscribe(render_time)

	logger.debug("🟢 Initialised timer.")
}
