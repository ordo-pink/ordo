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
import { Nullable } from "@ordo-pink/tau"
import { __Sidebar$ } from "$streams/sidebar"
import { cmd } from "@ordo-pink/frontend-core"
import Link from "./link"
import { Title } from "./page-header"
import { UserUtils } from "$utils/user-utils.util"
import { Hosts } from "$utils/hosts"

const commands = getCommands()

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
		commands.emit<cmd.sidebar.setSize>("sidebar.set-size", [0, 100])
	}

	const openCommandPalette = () =>
		commandPaletteItems &&
		commands.emit<cmd.commandPalette.show>("command-palette.show", commandPaletteItems)
	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.contextMenu.show>("context-menu.show", { event })

	return (
		<div
			className="h-screen w-full flex justify-between flex-col p-4 bg-neutral-200 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			<div>
				<div className="flex items-center justify-between">
					<img src={`${Hosts.STATIC}/logo.png`} className="w-10" alt="Ordo.pink Logo" />
					<div className="text-neutral-500 cursor-pointer" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>

				<div>{children}</div>
			</div>

			<div className="w-full flex space-x-2 items-center justify-center">
				<div className="flex items-center justify-center rounded-full mt-1 p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
					<div className="bg-white rounded-full">
						<Link href="/user">
							<img
								className="h-10 rounded-full"
								src={`${process.env.REACT_APP_STATIC_HOST}/logo.png`}
								alt="avatar"
							/>
						</Link>
					</div>
				</div>
				<div className="w-full max-w-md">
					<div>
						{user.fold(Null, u => (
							<Title level="5" styledFirstLetter trim>
								{UserUtils.getUserName(u)}
							</Title>
						))}
					</div>
					<div>
						<UsedSpace />
					</div>
				</div>
			</div>
		</div>
	)
}
