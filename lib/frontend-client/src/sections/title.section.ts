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

import { BehaviorSubject } from "rxjs"

import { call_once, is_non_empty_string, is_string, is_undefined } from "@ordo-pink/tau"
import { type TLogger } from "@ordo-pink/logger"
import { type TTitleState } from "@ordo-pink/core"

type TInitTitleStreamFn = (logger: TLogger, commands: Client.Commands.Commands) => void
export const init_title_display: TInitTitleStreamFn = call_once((logger, commands) => {
	logger.debug("🟡 Initialising title stream...")

	commands.on(
		"cmd.application.set_title",
		state =>
			is_non_empty_string(state.window_title) &&
			(is_undefined(state.status_bar_title) || is_string(state.status_bar_title)) &&
			title$.next(state),
	)

	const title_element = document.querySelector("title") as HTMLTitleElement
	const status_bar_title_element = document.querySelector("#status-bar_title") as HTMLDivElement

	title$.subscribe(({ window_title, status_bar_title = window_title }) => {
		title_element.innerText = `${window_title} | Ordo.pink`
		status_bar_title_element.innerText = status_bar_title
	})

	logger.debug("🟢 Initialised title.")
})

// --- Internal ---

const title$ = new BehaviorSubject<TTitleState>({
	window_title: "Loading...",
})
