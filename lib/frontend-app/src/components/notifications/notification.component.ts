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
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { noop } from "@ordo-pink/tau"

import { OrdoNotificationHideButton } from "./notification-hide-button.component"
import { OrdoNotificationIcon } from "./notification-icon.component"
import { OrdoNotificationProgress } from "./notification-progress.component"
import { get_readable_type } from "./utils/common"
import { ordo_app_state } from "../../../app.state"

type P = Ordo.Notification.Instance
export const OrdoNotification = ({ on_click, id, message, duration, render_icon, title, type }: P) =>
	Maoka.create("div", ({ use }) => {
		const t = ordo_app_state.zags.select("translate")

		use(maoka_jabs.set_class("notification-card_container"))

		if (on_click) {
			use(maoka_jabs.add_class("interactive"))
			use(maoka_jabs.listen("onclick", on_click))
		} else {
			use(maoka_jabs.remove_class("interactive"))
			use(maoka_jabs.listen("onclick", noop))
		}

		const card_type = get_readable_type(type)
		const NotificationCard = create_notification_card(card_type)

		return () =>
			NotificationCard(() => () => [
				OrdoNotificationIcon({ render_icon, type }),
				NotificationCardBody(() => () => [
					title ? NotificationTitle(() => () => t(title)) : void 0,
					NotificationMessage(() => () => t(message)),
				]),
				OrdoNotificationProgress({ id, duration, type }),
				OrdoNotificationHideButton({ id, type }),
			])
	})

// --- Internal ---

const create_notification_card = (card_type: string) => MaokaStyled.Tags.div(`notification-card ${card_type}`)

const NotificationCardBody = MaokaStyled.Tags.div("notification-card_body")

const NotificationMessage = MaokaStyled.Tags.p()

const NotificationTitle = MaokaStyled.Tags.h2("notification-card_title")
