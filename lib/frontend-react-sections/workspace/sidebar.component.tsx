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

// import { BsThreeDotsVertical } from "react-icons/bs"
import { type MouseEvent, Suspense } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"

import {
	useCommands,
	useHosts,
	useStrictSubscription,
	useSubscription,
	useUser,
} from "@ordo-pink/frontend-react-hooks"
import { globalCommandPalette$ } from "@ordo-pink/frontend-stream-command-palette"
import { sidebar$ } from "@ordo-pink/frontend-stream-sidebar"

import Heading from "@ordo-pink/frontend-react-components/heading"
import Link from "@ordo-pink/frontend-react-components/link"
import UsedSpace from "@ordo-pink/frontend-react-components/used-space"

// import Link from "next/link"

type P = PropsWithChildren<{ isNarrow: boolean }>
export default function Sidebar({ children, isNarrow }: P) {
	const user = useUser()
	const commands = useCommands()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const commandPalette = useSubscription(globalCommandPalette$)
	const { staticHost } = useHosts()

	const onSidebarClick = () => {
		if (!isNarrow || sidebar.disabled || sidebar.sizes[0] === 0) return
		commands.emit<cmd.sidebar.setSize>("sidebar.set-size", [0, 100])
	}

	const openCommandPalette = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		commandPalette && commands.emit<cmd.commandPalette.show>("command-palette.show", commandPalette)
	}
	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event })

	return (
		<div
			className="flex h-screen w-full flex-col justify-between overflow-y-hidden bg-neutral-200 px-4 py-3 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<img src={`${staticHost}/logo.png`} className="w-8" alt="Ordo.pink Logo" />
					<div className="cursor-pointer text-2xl text-neutral-500" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>

			<div className="my-2 h-full grow overflow-y-auto">
				<Suspense>{children}</Suspense>
			</div>

			<div className="flex w-full items-center justify-center space-x-2">
				<div className="mt-1 flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
					<div className="rounded-full bg-white">
						<Link href="/user">
							<img className="h-10 rounded-full" src={`${staticHost}/logo.png`} alt="avatar" />
						</Link>
					</div>
				</div>
				<div className="w-full max-w-md">
					<div>
						{user && (
							<Heading level="5" styledFirstLetter trim>
								{user.firstName}
							</Heading>
						)}
					</div>
					<div>
						<UsedSpace />
					</div>
				</div>
			</div>
		</div>
	)
}
