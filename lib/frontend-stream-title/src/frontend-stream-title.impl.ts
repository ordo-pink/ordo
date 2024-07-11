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

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"

import { call_once } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getLogger } from "@ordo-pink/frontend-logger"

export const __initTitle = call_once((fid: symbol) => {
	const commands = getCommands(fid)
	const logger = getLogger(fid)

	logger.debug("Initialising title...")

	commands.on<cmd.application.setTitle>("application.set-title", title =>
		title$.next(`${title} | Ordo.pink`),
	)

	logger.debug("Initialised title.")
})

export const title$ = new BehaviorSubject<string>("Ordo.pink")
