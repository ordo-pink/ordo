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

import { maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"

import { sidebar$ } from "../workspace.state"

// TODO Automatically close sidebar in mobile if something was clicked
export const sidebar = maoka.create("aside", ({ use, node }) => {
	const { activities$, hunter } = use(client_maoka.context.consume)
	const get_sidebar = use(client_maoka.jabs.zags.marry$(sidebar$))
	const get_current_activity = use(client_maoka.jabs.zags.cheat$(activities$, "current"))
	const is_mobile = use(client_maoka.jabs.is_mobile)

	const handle_click = () => is_mobile && hunter.shoot("sidebar.hide")

	use(client_maoka.jabs.listen("onclick", handle_click))

	return () => {
		const { visible, enabled } = get_sidebar()

		const current_activity = get_current_activity()

		if (current_activity && current_activity.render_sidebar) hunter.shoot("sidebar.enable")
		else hunter.shoot("sidebar.disable")

		if (!visible || !enabled || !maoka_dom.node_guard(node) || !node.value.parentElement) return null
		else return sidebar_render_picker()
	}
})

// --- Internal ---

const sidebar_render_picker = maoka.create("div", ({ use, node }) => {
	const { activities$ } = use(client_maoka.context.consume)
	use(client_maoka.jabs.classes.set("sidebar"))

	const get_current_activity = use(client_maoka.jabs.zags.cheat$(activities$, "current"))

	return async () => {
		const current_activity = get_current_activity()

		// TODO 404
		if (current_activity && current_activity.render_sidebar && maoka_dom.node_guard(node)) {
			await current_activity.render_sidebar(node.value as HTMLDivElement)
		} else return null
	}
})
