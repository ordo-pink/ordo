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
			className="flex h-screen w-full flex-col justify-between overflow-y-hidden bg-neutral-200 px-4 py-3 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<img src={`${Hosts.STATIC}/logo.png`} className="w-8" alt="Ordo.pink Logo" />
					<div className="cursor-pointer text-2xl text-neutral-500" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div>

			<div className="my-2 h-full flex-grow overflow-y-auto">{children}</div>

			<div className="flex w-full items-center justify-center space-x-2">
				<div className="mt-1 flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
					<div className="rounded-full bg-white">
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
