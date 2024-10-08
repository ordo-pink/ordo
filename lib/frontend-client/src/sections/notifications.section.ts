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

import { Subject, map, merge, scan, shareReplay } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { NotificationType } from "@ordo-pink/core"
import { O } from "@ordo-pink/option"
import { TLogger } from "@ordo-pink/logger"

import { Notifications } from "../components/notifications"

declare global {
	interface MaokaState {
		notifications: Ordo.Notification.Instance[]
		notification_counters: Record<Ordo.Notification.Instance["id"], number>
	}
}

// TODO: Fix spacing between notifications
type P = { logger: TLogger; commands: Ordo.Command.Commands; ctx: Ordo.CreateFunction.Params }
export const init_notifications = ({ logger, commands, ctx }: P) => {
	logger.debug("🟡 Initialising notifications...")

	commands.on("cmd.application.notification.hide", payload => remove$.next(payload))
	commands.on("cmd.application.notification.show", payload =>
		add$.next({
			title: payload.title,
			id: payload.id ?? crypto.randomUUID(),
			type: payload.type ?? NotificationType.DEFAULT,
			duration: payload.duration,
			message: payload.message,
			on_click: payload.on_click,
			render_icon: payload.render_icon,
		}),
	)

	O.FromNullable(document.querySelector("#notifications"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: Notifications(ctx, notification$) })))
		.pipe(O.ops.map(({ root, component }) => Maoka.render_dom(root, component)))
		.cata(O.catas.or_else(log_div_not_found(logger)))

	logger.debug("🟢 Initialised notifications.")
}

// --- Internal ---

const addP = (i: Ordo.Notification.Instance) => (is: Ordo.Notification.Instance[]) =>
	is.some(({ id }) => id === i.id) ? is : [...is, i]
const removeP = (id: string) => (is: Ordo.Notification.Instance[]) => is.filter(a => a.id !== id)

const add$ = new Subject<Ordo.Notification.Instance>()
const remove$ = new Subject<string>()
const notification$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Ordo.Notification.Instance[]),
	shareReplay(1),
)

const log_div_not_found = (logger: TLogger) => () => logger.error("#notifications div not found.")
