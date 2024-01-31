// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Subject, map, merge, scan, shareReplay } from "rxjs"
import { useEffect, useState } from "react"
import { Commands, useSharedContext } from "@ordo-pink/frontend-core"
import { useStrictSubscription } from "$hooks/use-subscription"
import { Callout } from "$components/callout"
import { BsX } from "react-icons/bs"
import { Either } from "@ordo-pink/either"
import Null from "$components/null"

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
	const notifications = useStrictSubscription(notification$, [] as Notification.Item[])
	const { commands } = useSharedContext()

	useEffect(() => {
		commands.on<cmd.notification.show>("notification.show", showNotification)
		commands.on<cmd.notification.hide>("notification.hide", hideNotification)

		return () => {
			commands.off<cmd.notification.show>("notification.show", showNotification)
			commands.off<cmd.notification.hide>("notification.hide", hideNotification)
		}
	})

	return (
		<div className="flex fixed right-0 bottom-0 flex-col p-2 space-y-2 w-full max-w-sm">
			{notifications.map(notification => (
				<NotificationComponent key={notification.id} notification={notification} />
			))}
		</div>
	)
}

// --- Internal ---

// Define Observables to maintain notification state
const addP = (i: Notification.Item) => (is: Notification.Item[]) =>
	is.some(({ id }) => id === i.id) ? is : [...is, i]
const removeP = (id: string) => (is: Notification.Item[]) => is.filter(a => a.id !== id)

const addNotification$ = new Subject<Notification.Item>()
const removeNotification$ = new Subject<string>()
const notification$ = merge(
	addNotification$.pipe(map(addP)),
	removeNotification$.pipe(map(removeP)),
).pipe(
	scan((acc, f) => f(acc), [] as Notification.Item[]),
	shareReplay(1),
)

// Define command handlers
const showNotification: Commands.Handler<Notification.ShowNotificationParams> = ({ payload }) =>
	addNotification$.next({ ...payload, id: payload.id ?? crypto.randomUUID() })
const hideNotification: Commands.Handler<string> = ({ payload }) =>
	removeNotification$.next(payload)

/**
 * Notification component.
 */
type P = { notification: Notification.Item }
const NotificationComponent = ({ notification }: P) => {
	const [percentage, setPercentage] = useState(-1)
	const { commands } = useSharedContext()

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
			}, notification.duration * 10) as any
		}

		return () => {
			clearInterval(interval)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [percentage, notification])

	return (
		<div className="relative w-full h-full">
			<Callout type={notification.type}>
				<Title notification={notification} />
				<Message notification={notification} />
				<div
					className={`absolute top-2 right-2 rounded-full p-1 ${
						HoverColor[notification.type]
					} transition-colors duration-300 cursor-pointer`}
					onClick={() => commands.emit<cmd.notification.hide>("notification.hide", notification.id)}
				>
					<BsX />
				</div>

				<div
					className={`absolute bottom-0 left-1.5 right-1.5 rounded-full shadow-inner ${
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

const HoverColor: Record<Notification.Type, string> = {
	default: "hover:bg-neutral-300 hover:dark:bg-neutral-900",
	info: "hover:bg-sky-300 hover:dark:bg-sky-900",
	question: "hover:bg-violet-300 hover:dark:bg-violet-900",
	rrr: "hover:bg-rose-300 hover:dark:bg-rose-900",
	success: "hover:bg-emerald-300 hover:dark:bg-emerald-900",
	warn: "hover:bg-amber-300 hover:dark:bg-amber-900",
}

const ProgressColor: Record<Notification.Type, string> = {
	default: "bg-neutral-300 dark:bg-neutral-900",
	info: "bg-sky-300 dark:bg-sky-900",
	question: "bg-violet-300 dark:bg-violet-900",
	rrr: "bg-rose-300 dark:bg-rose-900",
	success: "bg-emerald-300 dark:bg-emerald-900",
	warn: "bg-amber-300 dark:bg-amber-900",
}

const CardColor: Record<Notification.Type, string> = {
	default: "bg-neutral-100 dark:bg-neutral-800",
	info: "bg-sky-100 dark:bg-sky-800",
	question: "bg-violet-100 dark:bg-violet-800",
	rrr: "bg-rose-100 dark:bg-rose-800",
	success: "bg-emerald-100 dark:bg-emerald-800",
	warn: "bg-amber-100 dark:bg-amber-800",
}

const Title = ({ notification }: P) =>
	Either.fromNullable(notification.title)
		.fix(() => notification.message)
		.fold(Null, title => <h4 className="font-bold">{title}</h4>)

const Message = ({ notification }: P) =>
	Either.fromNullable(notification.title).fold(Null, () => <p>{notification.message}</p>)
