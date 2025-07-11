/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { bs_arrow_left, bs_layout_sidebar_inset_reverse } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/sweech"

import { sidebar$ } from "../workspace.state"

export const sidebar_toggle = maoka.create("button", ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)
	const get_sidebar = use(maoka_sdk.jabs.zags.marry$(sidebar$))
	const translate = use(maoka_sdk.jabs.t$)

	use(maoka_sdk.jabs.classes.set("sidebar-toggle hidden"))
	use(maoka_sdk.jabs.listen("onclick", () => hunter.shoot("sidebar.toggle")))

	return () => {
		const { visible, enabled } = get_sidebar()

		const t_title = translate(visible ? "sidebar_commands_hide_title" : "sidebar_commands_show_title")

		use(maoka_sdk.jabs.set_attribute("title", t_title))
		if (enabled) use(maoka_sdk.jabs.classes.replace("hidden", "visible"))
		else use(maoka_sdk.jabs.classes.replace("visible", "hidden"))

		return sweech
			.of_true()
			.case(enabled && visible, () => bs_arrow_left({ classes: "sidebar-toggle_icon" })) // TODO Extract to class name
			.case(enabled && !visible, () => bs_layout_sidebar_inset_reverse())
			.default(() => null)
	}
})
