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
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { create } from "@ordo-pink/oss-maoka"
import { sweech_helpers } from "@ordo-pink/oss-sweech/extensions"

import { sidebar$ } from "../workspace.state"

export const sidebar_toggle = create.create("button", ({ use }) => {
	const { hunter } = use(client_maoka.context.consume)
	const get_sidebar = use(client_maoka.jabs.zags.marry$(sidebar$))
	const translate = use(client_maoka.jabs.t$)

	use(client_maoka.jabs.classes.set("sidebar-toggle hidden"))
	use(client_maoka.jabs.listen("onclick", () => hunter.shoot("sidebar.toggle")))

	return () => {
		const { visible, enabled } = get_sidebar()

		const t_title = translate(visible ? "sidebar_commands_hide_title" : "sidebar_commands_show_title")

		use(client_maoka.jabs.set_attribute("title", t_title))
		if (enabled) use(client_maoka.jabs.classes.replace("hidden", "visible"))
		else use(client_maoka.jabs.classes.replace("visible", "hidden"))

		return sweech_helpers
			.of_true()
			.case(enabled && visible, () => bs_arrow_left({ classes: "sidebar-toggle_icon" }))
			.case(enabled && !visible, () => bs_layout_sidebar_inset_reverse())
			.default(() => null)
	}
})
