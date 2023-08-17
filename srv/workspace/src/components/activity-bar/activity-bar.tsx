// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsThreeDotsVertical } from "react-icons/bs"
import { getCommands } from "$streams/commands"
import { useActivities } from "$streams/extensions"
import { useUser } from "$streams/auth"
import ActivityItem from "$components/activity-bar/activity"
import Null from "$components/null"
import { MouseEvent } from "react"
import { Unary } from "@ordo-pink/tau/mod"
import { __CommandPalette$ } from "$streams/command-palette"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { useAccelerator } from "$hooks/use-accelerator"
import { __Sidebar$ } from "$streams/sidebar"
import { cmd } from "@ordo-pink/libfe/mod"
import { Either } from "@ordo-pink/either/mod"

type ShowContextMenu = Unary<MouseEvent<HTMLDivElement>, void>

const commands = getCommands()

type _P = { commandPalette$: __CommandPalette$; sidebar$: __Sidebar$ }
export default function ActivityBar({ commandPalette$, sidebar$ }: _P) {
	const user = useUser()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const activities = useActivities()
	const commandPaletteItems = useSubscription(commandPalette$)

	const isSidebarCollapsed = sidebar.disabled || sidebar.sizes[0] === 0

	const showCommandPalette = () =>
		Either.fromNullable(commandPaletteItems).map(items =>
			commands.emit<cmd.commandPalette.show>("command-palette.show", items),
		)

	const showContextMenu: ShowContextMenu = (event: MouseEvent) =>
		commands.emit<cmd.contextMenu.show>("context-menu.show", { event })

	useAccelerator("mod+shift+p", showCommandPalette)

	return (
		<div
			onContextMenu={showContextMenu}
			className={`activity-bar h-screen ${
				sidebar.disabled ? "w-[calc(3rem-10px)]" : "w-12"
			} flex flex-col justify-between items-center py-4 text-lg sm:text-2xl z-50 bg-neutral-200 dark:bg-neutral-900`}
		>
			<div>
				<div
					className={`text-neutral-500 cursor-pointer transition-opacity duration-300 ${
						isSidebarCollapsed ? "opacity-100" : "opacity-0"
					}`}
				>
					<div onClick={showCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>
			<div className="flex flex-col space-y-4 items-center">
				{activities.map(activity =>
					activity.background ? null : <ActivityItem key={activity.name} activity={activity} />,
				)}
			</div>
			<div>
				{user.fold(Null, user => (
					<div
						className={`cursor-pointer transition-opacity duration-300 ${
							isSidebarCollapsed ? "opacity-100" : "opacity-0"
						}`}
					>
						{user.email && user.email.slice(0, 1)}
					</div>
				))}
			</div>
		</div>
	)
}
