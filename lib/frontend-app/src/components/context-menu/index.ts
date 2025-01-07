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

import { ordo_app_state } from "../../../app.state"

export const init_context_menu = () => {
	const { logger, commands } = ordo_app_state.zags.unwrap()

	logger.debug("🟡 Initialising context menu...")

	commands.on("cmd.application.context_menu.show", menu => {
		const structure = ordo_app_state.zags.select("sections.context_menu.items").filter(item => {
			const should_show = item?.should_show({ event: menu.event, payload: menu.payload }) ?? false

			// Avoid showing native context menu if there is something to show
			if (should_show && menu.event.stopPropagation) menu.event.stopPropagation()

			return should_show
		})

		ordo_app_state.zags.update("sections.context_menu.state", () => ({ ...menu, structure }))
	})
	commands.on("cmd.application.context_menu.hide", () =>
		ordo_app_state.zags.update("sections.context_menu.state", () => void 0),
	)

	commands.on("cmd.application.context_menu.add", new_item =>
		ordo_app_state.zags.update("sections.context_menu.items", items =>
			items.some(item => item.command === new_item.command) ? items : items.concat(new_item),
		),
	)
	commands.on("cmd.application.context_menu.remove", command =>
		ordo_app_state.zags.update("sections.context_menu.items", items => items.filter(item => item.command === command)),
	)

	logger.debug("🟢 Initialised context menu.")
}
