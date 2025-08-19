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

import { type ClientSDK } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { maoka } from "@ordo-pink/oss-maoka"

import { get_readable_type } from "./utils/common"
import { notifications$ } from "../notifications.state"

type Args = Pick<ClientSDK.Notification.Instance, "id" | "type"> & Required<Pick<ClientSDK.Notification.Instance, "duration">>

export const notification_progress = maoka.create<Args>("div", ({ id, type, duration, use }) => {
	const get_progress = use(client_maoka.jabs.zags.cheat$(notifications$, `progress_bars.${id}` as const))

	const { hunter } = use(client_maoka.context.consume)

	const handle_onmount = () => {
		const update_progress_bar = () => {
			notifications$.update("progress_bars", progress_bars => ({
				...progress_bars,
				[id]: progress_bars[id] === 0 ? 0 : !progress_bars[id] ? 100 : progress_bars[id] > 0 ? progress_bars[id] - 1 : 0,
			}))
		}

		update_progress_bar()
		const interval = setInterval(update_progress_bar, duration * 10)

		return () => clearInterval(interval)
	}

	use(client_maoka.jabs.classes.set("notification-card_progress"))
	use(maoka.dom.jabs.onmount(handle_onmount))

	return () => {
		const progress = get_progress()
		const notifications = notifications$.select("items")

		if (progress === 0 && notifications.some(notification => notification.id === id)) {
			hunter.shoot("notifications.hide", id)
			return
		}

		return progress_bar_foreground({ progress, type })
	}
})

// --- Internal ---

type P = Pick<ClientSDK.Notification.Instance, "type"> & { progress: number }
const progress_bar_foreground = maoka.create<P>("div", ({ progress, type, use }) => {
	if (!progress) return

	use(client_maoka.jabs.classes.set("notification-card_progress_foreground", get_readable_type(type)))
	use(client_maoka.jabs.set_style({ width: progress.toFixed(0).concat("%") }))
})
