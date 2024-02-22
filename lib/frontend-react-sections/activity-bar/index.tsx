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

import { BsThreeDotsVertical } from "react-icons/bs"
import { type MouseEvent } from "react"

import {
	useAccelerator,
	useCommands,
	useHosts,
	useStrictSubscription,
	useSubscription,
	useUser,
} from "@ordo-pink/frontend-react-hooks"
import { activities$ } from "@ordo-pink/frontend-stream-activities"

import { Either } from "@ordo-pink/either"
import { globalCommandPalette$ } from "@ordo-pink/frontend-stream-command-palette"
import { sidebar$ } from "@ordo-pink/frontend-stream-sidebar"

import Link from "@ordo-pink/frontend-react-components/link"

import ActivityItem from "./activity"

export default function ActivityBar() {
	const commands = useCommands()
	const { staticHost } = useHosts()

	const user = useUser()
	const activities = useStrictSubscription(activities$, [])

	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const commandPalette = useSubscription(globalCommandPalette$)

	const isSidebarCollapsed = sidebar.disabled || sidebar.sizes[0] === 0

	const showCommandPalette = () =>
		Either.fromNullable(commandPalette).map(items =>
			commands.emit<cmd.commandPalette.show>("command-palette.show", items),
		)

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event })

	useAccelerator("mod+shift+p", showCommandPalette)

	return (
		<div
			className="activity-bar fixed z-40 flex h-screen w-12 flex-col items-center justify-between bg-neutral-200 py-4 text-lg sm:text-2xl dark:bg-neutral-900"
			onContextMenu={showContextMenu}
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
					activity.background ? null : <ActivityItem key={activity.name} activity={activity} />,
				)}
			</div>
			<div>
				{user && (
					<div
						className={`cursor-pointer select-none transition-opacity duration-300 ${
							isSidebarCollapsed ? "opacity-100" : "pointer-events-none cursor-default opacity-0"
						}`}
					>
						<div className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
							<div className="rounded-full bg-white">
								<Link href="/user">
									<img className="h-7 rounded-full" src={`${staticHost}/logo.png`} alt="avatar" />
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
