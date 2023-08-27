// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Callout } from "$components/callout"
import Null from "$components/null"
import { getCommands } from "$streams/commands"
import { Either } from "@ordo-pink/either"
import { Notification, cmd } from "@ordo-pink/frontend-core"
import { BsX } from "react-icons/bs"

const commands = getCommands()

type _P = { notification: Notification.Item & { id: string } }
export default function NotificationComponent({ notification }: _P) {
	return (
		<div className="w-full h-full relative">
			<Callout type={notification.type}>
				<Title notification={notification} />
				<Message notification={notification} />
				<div
					className="absolute top-2 right-2 rounded-full p-1 hover:bg-rose-900 transition-colors duration-300 cursor-pointer"
					onClick={() => commands.emit<cmd.notification.hide>("notification.hide", notification.id)}
				>
					<BsX />
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
