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

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import { sidebar$ } from "../workspace.state"

export const workspace = maoka.create("main", ({ use, node }) => {
	const { activities$ } = use(client_maoka.context.consume)

	use(client_maoka.jabs.classes.set("workspace"))

	const get_current_activity = use(client_maoka.jabs.zags.cheat$(activities$, "current"))

	return () => {
		const activity = get_current_activity()

		return [workspace_renderer({ activity }), sidebar_padding_contractor({ parent_node: node })]
	}
})

// --- Internal ---

const sidebar_padding_contractor = maoka.create<{ parent_node: Maoka.Node }>("div", ({ parent_node, use }) => {
	const get_sidebar = use(client_maoka.jabs.zags.marry$(sidebar$))

	return () => {
		const sidebar = get_sidebar()

		if (maoka.dom.node_guard(parent_node))
			sweech
				.of_true()
				.case(sidebar.enabled && sidebar.visible, () => parent_node.value.classList.remove("no-sidebar"))
				.default(() => parent_node.value.classList.add("no-sidebar"))
	}
})

const workspace_renderer = maoka.create<{ activity: ClientSDK.Activity.Instance | null }>("div", ({ activity, node, use }) => {
	use(client_maoka.jabs.classes.set("h-full")) // TODO Move to CSS

	const handle_onmount = (n: Maoka.Dom.Node<HTMLElement>) => {
		if (activity && activity.render_workspace && maoka.dom.node_guard(node))
			void activity.render_workspace(node.value as HTMLDivElement)
		else n.value.innerHTML = "" // TODO 404
	}

	use(maoka.dom.jabs.onmount(handle_onmount))
})
