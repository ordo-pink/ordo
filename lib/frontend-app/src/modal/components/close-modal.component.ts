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

import * as maoka_sdk from "@ordo-pink/sdk-maoka"

import { bs_x } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { modal$ } from "../modal.state"

export const close_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	const handle_global_esc = (event: KeyboardEvent) => {
		if (event.code !== "Escape" || !modal$.select("instance")) return
		event.stopImmediatePropagation()
		hunter.shoot("modal.hide")
	}

	use(maoka_jabs.set_class("modal_close"))
	use(maoka_jabs.set_attribute("title", "Click here, or anywhere else outside the modal window, or press Escape to close."))
	use(maoka_jabs.listen("onclick", internal.handle_click(hunter)))
	use(maoka_jabs.listen_global_event("keydown", handle_global_esc))

	return () => bs_x({})
})

namespace internal {
	export const handle_click = (hunter: Ordo.Hunter) => () => void hunter.shoot("modal.hide")
}
