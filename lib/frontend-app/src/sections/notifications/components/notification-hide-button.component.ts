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
import { bs_x } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { maoka } from "@ordo-pink/oss-maoka"

import { get_readable_type } from "./utils/common"

type Args = Pick<ClientSDK.Notification.Instance, "id" | "type">
export const hide_notification_button = maoka.create<Args>("button", ({ id, type, use }) => {
	const { hunter } = use(client_maoka.context.consume)
	const readable_type = get_readable_type(type)

	const handle_click = (event: MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()

		hunter.shoot("notifications.hide", id)
	}

	use(client_maoka.jabs.classes.set("notification-card_close", readable_type))
	use(client_maoka.jabs.set_attribute("aria-label", "Close")) // TODO i18n
	use(client_maoka.jabs.listen("onclick", handle_click))

	return () => bs_x()
})
