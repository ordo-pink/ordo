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

import { maoka } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { notification } from "./notification.component"
import { notifications$ } from "../notifications.state"

// BUG Notification duration gets reset when rerendering
// TODO Notification stack when there are more than 5 notifications
export const notification_list = maoka.create("div", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("notification-list"))
	const t_pending_notifications = use(maoka_sdk.jabs.translate$("notifications_pending_notifications"))

	const get_list = use(maoka_sdk.jabs.zags.cheat$(notifications$, "items" as const))

	return () => {
		const notifications = get_list()
		const has_pending_notifications = notifications.length > 5

		return [
			...get_list()
				.slice(0, 5)
				.map(item => notification(item)),

			has_pending_notifications
				? hidden_notifications_block(() =>
						hidden_notifications_list(() => [t_pending_notifications(), " ", notifications.length - 5]),
					)
				: void 0,
		]
	}
})

// --- Internal ---

const hidden_notifications_block = maoka.create("div", ({ kindergarten, use }) => {
	use(maoka_sdk.jabs.classes.set("more-notifications_card"))
	return kindergarten
})

const hidden_notifications_list = maoka.create("div", ({ kindergarten, use }) => {
	use(maoka_sdk.jabs.classes.set("more-notifications_body"))
	return kindergarten
})
