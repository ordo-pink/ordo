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

import { context, maoka_sdk } from "@ordo-pink/sdk-maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { maoka } from "@ordo-pink/maoka"

import { activity_bar_icon } from "./activity-bar-icon.component"

type Args = { item: ClientSDK.Activity.Instance; is_current: boolean }
export const activity_bar_link = maoka.create<Args>("a", ({ is_current, item, use }) => {
	const { hunter } = use(context.consume)

	const url = item.start_route ?? item.routes[0]
	const t_title = use(maoka_sdk.jabs.translate$(item.readable_name))

	const handle_click = (event: MouseEvent) => {
		event.preventDefault()
		hunter.shoot("router.set_pathname", url)
	}

	use(maoka_sdk.jabs.classes.set("activity-bar_link"))
	use(maoka_sdk.jabs.set_attribute("href", url))
	use(maoka_sdk.jabs.listen("onclick", handle_click))

	return () => {
		use(maoka_sdk.jabs.set_attribute("title", t_title()))

		return activity_bar_icon({ is_current, render_icon: item.render_icon!, readable_name: item.readable_name })
	}
})
