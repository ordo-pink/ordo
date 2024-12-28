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

import { ZAGS } from "@ordo-pink/zags"
import { call_once } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

type TInitTitleStreamFn = () => void
export const init_title_display: TInitTitleStreamFn = call_once(() => {
	const { commands, logger, translate } = ordo_app_state.zags.unwrap()

	logger.debug("🟡 Initialising title...")

	commands.on("cmd.application.set_title", title => title$.update("title", () => title))

	const title_element = document.querySelector("title") as HTMLTitleElement

	translate.$.marry((_, is_update) => {
		if (is_update) {
			const title = title$.select("title")
			title_element.innerText = `${translate(title)} | Ordo.pink`
		}
	})

	title$.marry(({ title }) => {
		title_element.innerText = `${translate(title)} | Ordo.pink`
	})

	logger.debug("🟢 Initialised title.")
})

// --- Internal ---

const title$ = ZAGS.Of<{ title: Ordo.I18N.TranslationKey }>({ title: "t.common.state.loading" })
