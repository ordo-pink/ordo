// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsThreeDotsVertical } from "react-icons/bs"
import { MouseEvent, PropsWithChildren } from "react"
import { getCommands } from "$streams/commands"
import { useUser } from "$streams/auth"
import UsedSpace from "$components/used-space"
import Null from "$components/null"
import { __CommandPalette$ } from "$streams/command-palette"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { Nullable } from "#lib/tau/mod"
import { ShowContextMenuP } from "$streams/context-menu"
import { __Sidebar$ } from "$streams/sidebar"

const commands = getCommands()

// TODO: Use hosts
type _P = PropsWithChildren<{
	isNarrow: boolean
	commandPalette$: Nullable<__CommandPalette$>
	sidebar$: Nullable<__Sidebar$>
}>
export default function Sidebar({ children, isNarrow, commandPalette$, sidebar$ }: _P) {
	const user = useUser()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const commandPaletteItems = useSubscription(commandPalette$)

	const onSidebarClick = () => {
		if (!isNarrow || sidebar.disabled || sidebar.sizes[0] === 0) return
		commands.emit("sidebar.set-size", [0, 100])
	}

	const openCommandPalette = () => commands.emit("command-palette.show", commandPaletteItems)
	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<ShowContextMenuP>("context-menu.show", { event })

	return (
		<div
			className="h-screen w-full flex justify-between flex-col p-4 bg-neutral-200 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			<div>
				<div className="flex items-center justify-between">
					<img src="http://localhost:8000/logo.png" className="w-10" alt="Ordo.pink Logo" />
					<div className="text-neutral-500 cursor-pointer" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>

				<div>{children}</div>
			</div>

			<div>
				<div>{user.fold(Null, u => u.email)}</div>
				<div className="w-full">
					<UsedSpace />
				</div>
			</div>
		</div>
	)
}
