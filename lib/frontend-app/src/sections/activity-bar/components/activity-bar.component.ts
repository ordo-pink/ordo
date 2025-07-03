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

import { type Maoka, maoka, maoka_styled } from "@ordo-pink/maoka"
import { type ClientSDK } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { activity_bar_link } from "./activity-bar-link.component"

export const activity_bar = maoka.create<{
	sidebar_toggle: () => Maoka.Component
	command_palette_toggle: () => Maoka.Component
}>("div", ({ command_palette_toggle, sidebar_toggle, use }) => {
	const { activities$ } = use(maoka_sdk.context.consume)
	const get_state = use(maoka_sdk.jabs.zags.marry$(activities$))

	use(maoka_sdk.jabs.classes.set("activity-bar"))

	return () => {
		const { current, items } = get_state()

		return [command_palette_toggle(), activity_bar_activities(() => items.map(render_activity(current))), sidebar_toggle()]
	}
})

const render_activity = (current: ClientSDK.Activity.Instance | null) => (item: ClientSDK.Activity.Instance) =>
	item.render_icon && activity_bar_link({ is_current: !!current && current.id === item.id, item })

const activity_bar_activities = maoka_styled.div("activity-bar_activities")
