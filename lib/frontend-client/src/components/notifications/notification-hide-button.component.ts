// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BS_X } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { get_readable_type } from "./common"

type P = Pick<Ordo.Notification.Instance, "id" | "type">
export const NotificationHideButton = ({ id, type }: P) =>
	Maoka.create("button", ({ use }) => {
		const commands = use(MaokaOrdo.Jabs.Commands.get)
		const readable_type = get_readable_type(type)

		use(MaokaJabs.set_inner_html(BS_X))
		use(MaokaJabs.set_class("notification-card_close", readable_type))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			event.stopPropagation()

			commands.emit("cmd.application.notification.hide", id)
		}
	})
