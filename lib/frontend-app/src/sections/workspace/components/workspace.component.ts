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

import { type Maoka, maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import { sidebar$ } from "../workspace.state"

export const workspace = maoka.create("main", ({ use, node }) => {
	use(client_maoka.jabs.classes.set("workspace"))

	return () => [workspace_renderer(), sidebar_padding_contractor({ parent_node: node })]
})

// --- Internal ---

const sidebar_padding_contractor = maoka.create<{ parent_node: Maoka.Node }>("div", ({ parent_node, use }) => {
	const get_sidebar = use(client_maoka.jabs.zags.marry$(sidebar$))

	return () => {
		const sidebar = get_sidebar()

		if (maoka_dom.guards.is_dom_node(parent_node))
			sweech
				.of_true()
				.case(sidebar.enabled && sidebar.visible, () => parent_node.value.classList.remove("no-sidebar"))
				.default(() => parent_node.value.classList.add("no-sidebar"))
	}
})

const workspace_renderer = maoka.create("div", ({ node, use }) => {
	const { activities$ } = use(client_maoka.context.consume)

	use(client_maoka.jabs.classes.set("h-full")) // TODO Move to CSS
	const get_current_activity = use(client_maoka.jabs.zags.cheat$(activities$, "current"))

	return async () => {
		const current_activity = get_current_activity()

		// TODO 404
		if (current_activity && current_activity.render_workspace && maoka_dom.guards.is_dom_node(node)) {
			await current_activity.render_workspace(node.value as HTMLDivElement)
		} else return null
	}
})
