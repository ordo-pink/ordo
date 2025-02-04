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
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { ZAGS } from "@ordo-pink/zags"

export const OrdoTitleDisplay = Maoka.create("div", ({ use, onunmount }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)
	const { t } = use(MaokaOrdo.Jabs.get_translations$)
	const get_title = use(MaokaOrdo.Jabs.happy_marriage$(title$, s => s.title))
	const title_element = document.querySelector("title") as HTMLTitleElement

	const handle_set_title = (title: Ordo.I18N.TranslationKey) => title$.update("title", () => title)

	commands.on("cmd.application.set_title", handle_set_title)

	onunmount(() => {
		commands.off("cmd.application.set_title", handle_set_title)
	})

	return () => {
		const title = get_title()
		const t_title = t(title).concat(" | Ordo.pink")

		title_element.innerText = t_title
	}
})

// --- Internal ---

const title$ = ZAGS.Of<{ title: Ordo.I18N.TranslationKey }>({ title: "t.common.state.loading" })
