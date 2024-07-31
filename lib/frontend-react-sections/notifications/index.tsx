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

import { useEffect, useState } from "react"
import { BsX } from "react-icons/bs"
import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { useCommands, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import Callout from "@ordo-pink/frontend-react-components/callout"
import Null from "@ordo-pink/frontend-react-components/null"

/**
 * Shows notifications in the bottom right corner. There are various options for the notifications.
 * Check the `cmd.notifications.show` command for more details. If you want to be able to hide
 * a notification, make sure you provided an `id` when showing it. Also keep in mind that if you
 * require showing multiple notifications with the same `id`, only the first one will be shown.
 *
 * @commands
 * - `cmd.notifications.show`
 * - `cmd.notifications.hide`
 */
export default function Notifications() {
	const notifications = useStrictSubscription(notification$, [] as Client.Notification.Item[])
	const commands = useCommands()

	useEffect(() => {
		commands.on<cmd.notification.show>("notification.show", showNotification)
		commands.on<cmd.notification.hide>("notification.hide", hideNotification)

		return () => {
			commands.off<cmd.notification.show>("notification.show", showNotification)
			commands.off<cmd.notification.hide>("notification.hide", hideNotification)
		}
	})

	return (
		<div className="fixed bottom-0 right-0 z-50 flex w-full max-w-sm flex-col space-y-2 p-2">
			{notifications.map(notification => (
				<NotificationComponent key={notification.id} notification={notification} />
			))}
		</div>
	)
}

// --- Internal ---

// Define Observables to maintain notification state
const addP = (i: Client.Notification.Item) => (is: Client.Notification.Item[]) =>
	is.some(({ id }) => id === i.id) ? is : [...is, i]
const removeP = (id: string) => (is: Client.Notification.Item[]) => is.filter(a => a.id !== id)

const addNotification$ = new Subject<Client.Notification.Item>()
const removeNotification$ = new Subject<string>()
const notification$ = merge(
	addNotification$.pipe(map(addP)),
	removeNotification$.pipe(map(removeP)),
).pipe(
	scan((acc, f) => f(acc), [] as Client.Notification.Item[]),
	shareReplay(1),
)

// Define command handlers
const showNotification: Client.Commands.TCommandHandler<
	Client.Notification.ShowNotificationParams
> = payload => addNotification$.next({ ...payload, id: payload.id ?? crypto.randomUUID() })
const hideNotification: Client.Commands.TCommandHandler<string> = payload =>
	removeNotification$.next(payload)

/**
 * Notification component.
 */
type P = { notification: Client.Notification.Item }
const NotificationComponent = ({ notification }: P) => {
	const [percentage, setPercentage] = useState(-1)
	const commands = useCommands()

	useEffect(() => {
		let interval: number

		if (notification.duration) {
			if (percentage === -1) setPercentage(100)

			interval = setInterval(() => {
				setPercentage(p => (p > 0 ? p - 1 : 0))

				if (percentage === 0) {
					clearInterval(interval)
					commands.emit<cmd.notification.hide>("notification.hide", notification.id)
				}
			}, notification.duration * 10) as unknown as number
		}

		return () => {
			clearInterval(interval)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [percentage, notification])

	return (
		<div
			className={`relative inset-x-0 top-0 z-50 size-full ${notification.onClick ? "cursor-pointer" : ""}`}
			onClick={notification.onClick}
		>
			<Callout type={notification.type} Icon={notification.Icon}>
				<Heading notification={notification} />
				<Message notification={notification} />

				<div
					className={`absolute right-2 top-2 rounded-full p-1 ${
						HoverColor[notification.type]
					} cursor-pointer transition-colors duration-300`}
					onClick={() => commands.emit<cmd.notification.hide>("notification.hide", notification.id)}
				>
					<BsX />
				</div>

				<div
					className={`absolute inset-x-1.5 bottom-0 rounded-full shadow-inner ${
						ProgressColor[notification.type]
					}`}
				>
					<div
						className={`h-1 rounded-full ${CardColor[notification.type]}`}
						style={{ width: `${percentage.toFixed(0)}%` }}
					/>
				</div>
			</Callout>
		</div>
	)
}

// --- Internal ---

const HoverColor: Record<Client.Notification.Type, string> = {
	default: "hover:bg-neutral-300 hover:dark:bg-neutral-900",
	info: "hover:bg-sky-300 hover:dark:bg-sky-900",
	question: "hover:bg-violet-300 hover:dark:bg-violet-900",
	rrr: "hover:bg-rose-300 hover:dark:bg-rose-900",
	success: "hover:bg-emerald-300 hover:dark:bg-emerald-900",
	warn: "hover:bg-amber-300 hover:dark:bg-amber-900",
}

const ProgressColor: Record<Client.Notification.Type, string> = {
	default: "bg-neutral-300 dark:bg-neutral-900",
	info: "bg-sky-300 dark:bg-sky-900",
	question: "bg-violet-300 dark:bg-violet-900",
	rrr: "bg-rose-300 dark:bg-rose-900",
	success: "bg-emerald-300 dark:bg-emerald-900",
	warn: "bg-amber-300 dark:bg-amber-900",
}

const CardColor: Record<Client.Notification.Type, string> = {
	default: "bg-neutral-100 dark:bg-neutral-800",
	info: "bg-sky-100 dark:bg-sky-800",
	question: "bg-violet-100 dark:bg-violet-800",
	rrr: "bg-rose-100 dark:bg-rose-800",
	success: "bg-emerald-100 dark:bg-emerald-800",
	warn: "bg-amber-100 dark:bg-amber-800",
}

const Heading = ({ notification }: P) =>
	Either.fromNullable(notification.title)
		.fix(() => notification.message)
		.fold(Null, title => <h4 className="font-bold">{title}</h4>)

const Message = ({ notification }: P) =>
	Either.fromNullable(notification.title).fold(Null, () => <p>{notification.message}</p>)
