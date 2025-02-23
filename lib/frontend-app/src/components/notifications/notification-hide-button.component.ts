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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { get_readable_type } from "./utils/common"
import { ordo_app_state } from "../../../app.state"

type P = Pick<Ordo.Notification.Instance, "id" | "type">
export const OrdoNotificationHideButton = ({ id, type }: P) =>
	Maoka.create("button", ({ use }) => {
		const commands = ordo_app_state.zags.select("commands")
		const readable_type = get_readable_type(type)

		use(MaokaJabs.set_inner_html(BS_X))
		use(MaokaJabs.set_class("notification-card_close", readable_type))
		use(MaokaJabs.set_attribute("aria-label", "Close")) // TODO i18n
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			event.stopPropagation()

			commands.emit("cmd.application.notification.hide", id)
		}
	})

// --- Internal ---

const BS_X = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
</svg>`
