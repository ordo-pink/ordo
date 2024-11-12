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

import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

type TInitTitleStreamFn = (
	logger: TLogger,
	commands: Ordo.Command.Commands,
	translate: Ordo.I18N.TranslateFn,
) => void
export const init_title_display: TInitTitleStreamFn = call_once((logger, commands, translate) => {
	logger.debug("🟡 Initialising title stream...")

	commands.on("cmd.application.set_title", title => title$.next(title))

	const title_element = document.querySelector("title") as HTMLTitleElement

	title$.subscribe(title => {
		title_element.innerText = `${translate(title)} | Ordo.pink`
	})

	logger.debug("🟢 Initialised title.")
})

// --- Internal ---

const title$ = new BehaviorSubject<Ordo.I18N.TranslationKey>("t.common.state.loading")
