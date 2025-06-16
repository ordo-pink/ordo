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

import type { ClientSDK } from "@ordo-pink/sdk-client"
import { maoka } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { get_readable_type } from "./utils/common"
import { hide_notification_button } from "./notification-hide-button.component"
import { notification_icon } from "./notification-icon.component"
import { notification_progress } from "./notification-progress.component"

export const notification = maoka.create<ClientSDK.Notification.Instance>(
	"div",
	({ on_click, id, message, duration, render_icon, title, type, use }) => {
		const t_title = use(maoka_sdk.jabs.translate$(title))
		const t_message = use(maoka_sdk.jabs.translate$(message))

		use(maoka_sdk.jabs.classes.set("notification-card_container"))

		if (on_click) {
			use(maoka_sdk.jabs.classes.add("interactive"))
			use(maoka_sdk.jabs.listen("onclick", on_click))
		} else {
			use(maoka_sdk.jabs.classes.remove("interactive"))
			use(maoka_sdk.jabs.listen("onclick", () => void 0))
		}

		const card_type = get_readable_type(type)
		const notification_card = create_notification_card(card_type)

		return () =>
			notification_card(() => [
				notification_icon({ render_icon, type }),
				notification_body(() => [title ? notification_title(t_title) : void 0, notification_message(t_message)]),
				notification_progress({ id, duration, type }),
				hide_notification_button({ id, type }),
			])
	},
)

// --- Internal ---

const create_notification_card = (card_type: string) =>
	maoka.create("div", ({ kindergarten, use }) => {
		use(maoka_sdk.jabs.classes.set(`notification-card ${card_type}`))
		return kindergarten
	})

const notification_body = maoka.create("div", ({ kindergarten, use }) => {
	use(maoka_sdk.jabs.classes.set("notification-card_body"))
	return kindergarten
})

const notification_message = maoka.create("p", ({ kindergarten }) => kindergarten)

const notification_title = maoka.create("h2", ({ kindergarten, use }) => {
	use(maoka_sdk.jabs.classes.set("notification-card_title"))
	return kindergarten
})
