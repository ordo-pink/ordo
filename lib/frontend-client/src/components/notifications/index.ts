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

import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { Notification } from "./notification.component"

import "./notifications.css"

// BUG Notification duration gets reset when rerendering
// TODO Notification stack when there are more than 5 notifications
export const Notifications = (
	ctx: Ordo.CreateFunction.Params,
	$: Observable<Ordo.Notification.Instance[]>,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("notification-list"))

		const get_list = use(MaokaOrdo.Jabs.from$($, [] as Ordo.Notification.Instance[]))

		return () => {
			const notifications = get_list()

			return notifications.map(item => Notification(item))
		}
	})
