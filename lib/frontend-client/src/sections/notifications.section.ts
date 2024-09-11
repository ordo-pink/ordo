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

import { O } from "@ordo-pink/option"
import { TCreateFunctionContext } from "@ordo-pink/core"
import { TLogger } from "@ordo-pink/logger"
import { render_dom } from "@ordo-pink/maoka"

import { Notifications } from "../components/notifications"

declare global {
	interface MaokaState {
		notifications: Client.Notification.Item[]
		notification_counters: Record<Client.Notification.Item["id"], number>
	}
}

// TODO: Fix spacing between notifications
type P = { logger: TLogger; commands: Client.Commands.Commands; ctx: TCreateFunctionContext }
export const init_notifications = ({ logger, commands, ctx }: P) => {
	logger.debug("🟡 Initialising notifications...")

	commands.on("cmd.application.notification.hide", payload => remove$.next(payload))
	commands.on("cmd.application.notification.show", payload =>
		add$.next({ ...payload, id: payload.id ?? crypto.randomUUID() }),
	)

	O.FromNullable(document.querySelector("#notifications"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: Notifications(ctx, notification$) })))
		.pipe(O.ops.map(({ root, component }) => render_dom(root, component)))
		.cata(O.catas.or_else(log_div_not_found(logger)))

	logger.debug("🟢 Initialised notifications.")
}

// --- Internal ---

const addP = (i: Client.Notification.Item) => (is: Client.Notification.Item[]) =>
	is.some(({ id }) => id === i.id) ? is : [...is, i]
const removeP = (id: string) => (is: Client.Notification.Item[]) => is.filter(a => a.id !== id)

const add$ = new Subject<Client.Notification.Item>()
const remove$ = new Subject<string>()
const notification$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as Client.Notification.Item[]),
	shareReplay(1),
)

const log_div_not_found = (logger: TLogger) => () => logger.error("#notifications div not found.")
