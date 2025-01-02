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
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { get_readable_type } from "./common"

type P = Pick<Ordo.Notification.Instance, "id" | "type" | "duration">
export const NotificationProgress = ({ id, type, duration }: P) => {
	if (!duration) return

	return Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(MaokaJabs.set_class("notification-card_progress"))

		let progress = 100

		const commands = use(MaokaOrdo.Jabs.get_commands.get)
		const interval = setInterval(() => {
			progress = progress > 0 ? progress - 1 : 0
			void refresh()
		}, duration * 10)

		on_unmount(() => clearInterval(interval))

		return () => {
			if (progress === 0) {
				commands.emit("cmd.application.notification.hide", id)
				return
			}

			return ProgressBarForeground({ progress, type })
		}
	})
}

// --- Internal ---

type P1 = Pick<Ordo.Notification.Instance, "type"> & { progress: number }
const ProgressBarForeground = ({ progress, type }: P1) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("notification-card_progress_foreground", get_readable_type(type)))
		use(MaokaJabs.set_style({ width: progress.toFixed(0).concat("%") }))
	})
