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

import { Button } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { DATABASE_CONTEXT_MENU_PAYLOAD } from "../database.constants"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

export const DatabaseOptions = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("pb-2 flex justify-end"))

	const commands = use(MaokaOrdo.Jabs.get_commands.get)

	return () =>
		Button.Primary({
			hotkey: "mod+,",
			// TODO Set event pageX and pageY to the bounding rect of the element
			on_click: event => commands.emit("cmd.application.context_menu.show", { event, payload: DATABASE_CONTEXT_MENU_PAYLOAD }),
			text: "Options",
		})
})
