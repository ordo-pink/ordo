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

import { client_maoka } from "@ordo-pink/sdk-client-maoka"

import type { ClientSDK } from "@ordo-pink/sdk-client"
import { bs_x } from "@ordo-pink/frontend-icons"
import { create_component } from "@ordo-pink/oss-maoka"

import { modal$ } from "../modal.state"

export const close_modal = create_component.create("div", ({ use }) => {
	const { hunter } = use(client_maoka.context.consume)

	const handle_global_esc = (event: KeyboardEvent) => {
		if (event.code !== "Escape" || !modal$.select("instance")) return
		event.stopImmediatePropagation()
		hunter.shoot("modal.hide")
	}

	use(client_maoka.jabs.classes.set("modal_close"))
	use(
		client_maoka.jabs.set_attribute(
			"title",
			"Click here, or anywhere else outside the modal window, or press Escape to close.",
		),
	)
	use(client_maoka.jabs.listen("onclick", internal.handle_click(hunter)))
	use(client_maoka.jabs.listen_global_event("keydown", handle_global_esc))

	return () => bs_x({})
})

namespace internal {
	export const handle_click = (hunter: ClientSDK.Hunter) => () => void hunter.shoot("modal.hide")
}
