// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsThreeDotsVertical } from "react-icons/bs"
import type { MouseEvent } from "react"

import {
	useAccelerator,
	useStrictSubscription,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import Null from "@ordo-pink/frontend-react-components/null"
import { useCommands } from "@ordo-pink/frontend-stream-commands"

import Link from "@ordo-pink/frontend-react-components/link"

import ActivityItem from "./activity"

type ShowContextMenu = (event: MouseEvent<HTMLDivElement>) => void

type _P = {
	commandPalette$: __CommandPalette$
	sidebar$: __Sidebar$
	activities$: __Activities$
	currentActivity$: __CurrentActivity$
}
export default function ActivityBar({
	commandPalette$,
	sidebar$,
	activities$,
	currentActivity$,
}: _P) {
	const commands = useCommands()

	const user = useUser()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const activities = useStrictSubscription(activities$, [])
	const commandPalette = useSubscription(commandPalette$)

	const isSidebarCollapsed = sidebar.disabled || sidebar.sizes[0] === 0

	const showCommandPalette = () =>
		Either.fromNullable(commandPalette).map(items =>
			commands.emit<cmd.commandPalette.show>("command-palette.show", items),
		)

	const showContextMenu: ShowContextMenu = (event: MouseEvent) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event })

	useAccelerator("mod+shift+p", showCommandPalette)

	return (
		<div
			onContextMenu={showContextMenu}
			className={`activity-bar fixed z-50 flex h-screen w-12 flex-col items-center justify-between bg-neutral-200 py-4 text-lg dark:bg-neutral-900 sm:text-2xl`}
		>
			<div>
				<div
					className={`cursor-pointer select-none text-neutral-500 transition-opacity duration-300 ${
						isSidebarCollapsed ? "opacity-100" : "pointer-events-none cursor-default opacity-0"
					}`}
				>
					<div onClick={showCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center space-y-4">
				{activities.map(activity =>
					activity.background ? null : (
						<ActivityItem
							key={activity.name}
							activity={activity}
							currentActivity$={currentActivity$}
						/>
					),
				)}
			</div>
			<div>
				{user.fold(Null, user => (
					<div
						className={`cursor-pointer select-none transition-opacity duration-300 ${
							isSidebarCollapsed ? "opacity-100" : "pointer-events-none cursor-default opacity-0"
						}`}
					>
						<div className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
							<div className="rounded-full bg-white">
								<Link href="/user">
									<img className="h-7 rounded-full" src={`${Hosts.STATIC}/logo.png`} alt="avatar" />
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
