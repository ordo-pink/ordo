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
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { maoka } from "@ordo-pink/oss-maoka"

import { get_readable_type } from "./utils/common"
import { hide_notification_button } from "./notification-hide-button.component"
import { notification_icon } from "./notification-icon.component"
import { notification_progress } from "./notification-progress.component"

type Args = ClientSDK.Notification.Instance
export const notification = maoka.create<Args>("div", ({ on_click, id, message, duration, render_icon, title, type, use }) => {
	const t_title = use(client_maoka.jabs.translate$(title))
	const t_message = use(client_maoka.jabs.translate$(message))

	use(client_maoka.jabs.classes.set("notification-card_container"))

	if (on_click) {
		use(client_maoka.jabs.classes.add("interactive"))
		use(client_maoka.jabs.listen("onclick", on_click))
	} else {
		use(client_maoka.jabs.classes.remove("interactive"))
		use(client_maoka.jabs.listen("onclick", () => void 0))
	}

	const card_type = get_readable_type(type)
	const notification_card = create_notification_card(card_type)

	return () =>
		notification_card(() => [
			notification_icon({ render_icon, type }),
			notification_body(() => [title ? notification_title(t_title) : void 0, notification_message(t_message)]),
			duration ? notification_progress({ id, duration, type }) : void 0,
			hide_notification_button({ id, type }),
		])
})

// --- Internal ---

const create_notification_card = (card_type: string) => maoka.styled.div(`notification-card ${card_type}`)
const notification_body = maoka.styled.div("notification-card_body")
const notification_message = maoka.styled.p()
const notification_title = maoka.styled.h2("notification-card_title")
