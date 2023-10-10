// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Callout } from "$components/callout"
import Null from "$components/null"
import { getCommands } from "$streams/commands"
import { Either } from "@ordo-pink/either"
import { Notification, cmd } from "@ordo-pink/frontend-core"
import { useEffect, useState } from "react"
import { BsX } from "react-icons/bs"

const commands = getCommands()

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

type _P = { notification: Notification.Item & { id: string } }
export default function NotificationComponent({ notification }: _P) {
	const [percentage, setPercentage] = useState(-1)

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
	}, [percentage, notification.duration])

	return (
		<div className="w-full h-full relative">
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

const Title = ({ notification }: _P) =>
	Either.fromNullable(notification.title)
		.fix(() => notification.message)
		.fold(Null, title => <h4 className="font-bold">{title}</h4>)

const Message = ({ notification }: _P) =>
	Either.fromNullable(notification.title).fold(Null, () => <p>{notification.message}</p>)
