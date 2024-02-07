// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useStrictSubscription } from "@ordo-pink/frontend-react-hooks"

import { activities$ } from "@ordo-pink/frontend-stream-activities"

import ActivityItem from "./activity"

// type ShowContextMenu = (event: MouseEvent<HTMLDivElement>) => void

export default function ActivityBar() {
	// const commands = useCommands()

	// const user = useUser()
	const activities = useStrictSubscription(activities$, [])

	// const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	// const commandPalette = useSubscription(commandPalette$)

	// const isSidebarCollapsed = sidebar.disabled || sidebar.sizes[0] === 0

	// const showCommandPalette = () =>
	// 	Either.fromNullable(commandPalette).map(items =>
	// 		commands.emit<cmd.commandPalette.show>("command-palette.show", items),
	// 	)

	// const showContextMenu: ShowContextMenu = (event: MouseEvent) =>
	// 	commands.emit<cmd.ctxMenu.show>("context-menu.show", { event })

	// useAccelerator("mod+shift+p", showCommandPalette)

	return (
		<div
			// onContextMenu={showContextMenu}
			className="activity-bar fixed z-50 flex h-screen w-12 flex-col items-center justify-between bg-neutral-200 py-4 text-lg sm:text-2xl dark:bg-neutral-900"
		>
			{/* <div>
				<div
					className={`cursor-pointer select-none text-neutral-500 transition-opacity duration-300 ${
						isSidebarCollapsed ? "opacity-100" : "opacity-0 cursor-default pointer-events-none"
					}`}
				>
					<div onClick={showCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div> */}
			<div className="flex flex-col items-center space-y-4">
				{activities.map(activity =>
					activity.background ? null : <ActivityItem key={activity.name} activity={activity} />,
				)}
			</div>
			{/* <div>
				{user.fold(Null, user => (
					<div
						className={`cursor-pointer select-none transition-opacity duration-300 ${
							isSidebarCollapsed ? "opacity-100" : "opacity-0 cursor-default pointer-events-none"
						}`}
					>
						<div className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
							<div className="bg-white rounded-full">
								<Link href="/user">
									<img className="h-7 rounded-full" src={`${Hosts.STATIC}/logo.png`} alt="avatar" />
								</Link>
							</div>
						</div>
					</div>
				))}
			</div> */}
		</div>
	)
}
