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
import { NotificationType } from "@ordo-pink/core"

import { OrdoNotification } from "./notification.component"
import { ordo_app_state } from "../../app.state"
import { ordo_notifications_state } from "./notifications.state"

import "./notifications.css"

// BUG Notification duration gets reset when rerendering
// TODO Notification stack when there are more than 5 notifications
export const OrdoNotifications = Maoka.create("div", ({ use, on_unmount }) => {
	const commands = ordo_app_state.zags.select("commands")
	const translate = ordo_app_state.zags.select("translate")

	commands.on("cmd.application.notification.hide", handle_notification_hide)
	commands.on("cmd.application.notification.show", handle_notification_show)

	on_unmount(() => {
		commands.off("cmd.application.notification.hide", handle_notification_hide)
		commands.off("cmd.application.notification.show", handle_notification_show)
	})

	use(MaokaJabs.set_class("notification-list"))

	const get_list = use(ordo_notifications_state.select_jab$("notifications"))

	return () => {
		const notifications = get_list()
		const has_pending_notifications = notifications.length > 5

		return [
			...get_list()
				.slice(0, 5)
				.map(item => OrdoNotification(item)),

			has_pending_notifications
				? MoreNotifications(() =>
						MoreNotificationsBody(() => [
							translate("t.common.components.notifications.pending_notifications"),
							" ",
							notifications.length - 5,
						]),
					)
				: void 0,
		]
	}
})

// --- Internal ---

const MoreNotifications = Maoka.styled("div", { class: "more-notifications_card" })

const MoreNotificationsBody = Maoka.styled("div", { class: "more-notifications_body" })

const handle_notification_hide: Ordo.Command.HandlerOf<"cmd.application.notification.hide"> = payload =>
	ordo_notifications_state.zags.update("notifications", prev_state =>
		prev_state.filter(notification => notification.id !== payload),
	)

const handle_notification_show: Ordo.Command.HandlerOf<"cmd.application.notification.show"> = payload =>
	ordo_notifications_state.zags.update("notifications", prev_state => [
		...prev_state,
		{
			title: payload.title,
			id: payload.id ?? crypto.randomUUID(),
			type: payload.type ?? NotificationType.DEFAULT,
			duration: payload.duration,
			message: payload.message,
			on_click: payload.on_click,
			render_icon: payload.render_icon,
		},
	])
