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
import { __Sidebar$ } from "$streams/sidebar"
import Link from "./link"
import { Title } from "./page-header"
import { UserUtils } from "$utils/user-utils.util"
import { Hosts } from "$utils/hosts"

const commands = getCommands()

type _P = PropsWithChildren<{
	isNarrow: boolean
	commandPalette$: __CommandPalette$ | null
	sidebar$: __Sidebar$ | null
}>
export default function Sidebar({ children, isNarrow, commandPalette$, sidebar$ }: _P) {
	const user = useUser()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const commandPalette = useSubscription(commandPalette$)

	const onSidebarClick = () => {
		if (!isNarrow || sidebar.disabled || sidebar.sizes[0] === 0) return
		commands.emit<cmd.sidebar.setSize>("sidebar.set-size", [0, 100])
	}

	const openCommandPalette = () =>
		commandPalette && commands.emit<cmd.commandPalette.show>("command-palette.show", commandPalette)
	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event })

	return (
		<div
			className="flex overflow-y-hidden flex-col justify-between px-4 py-3 w-full h-screen bg-neutral-200 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			<div className="flex flex-col">
				<div className="flex justify-between items-center">
					<img src={`${Hosts.STATIC}/logo.png`} className="w-8" alt="Ordo.pink Logo" />
					<div className="text-2xl cursor-pointer text-neutral-500" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>

			<div className="overflow-y-auto flex-grow my-2 h-full">{children}</div>

			<div className="flex justify-center items-center space-x-2 w-full">
				<div className="flex items-center justify-center rounded-full mt-1 p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer">
					<div className="bg-white rounded-full">
						<Link href="/user">
							<img
								className="h-10 rounded-full"
								src={`${process.env.REACT_APP_ORDO_STATIC_HOST}/logo.png`}
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
