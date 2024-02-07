// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// import { BsThreeDotsVertical } from "react-icons/bs"
import { type MouseEvent } from "react"

import { useCommands, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { sidebar$ } from "@ordo-pink/frontend-stream-sidebar"

// import Link from "next/link"

type P = PropsWithChildren<{ isNarrow: boolean }>
export default function Sidebar({ children, isNarrow }: P) {
	// const user = useUser()
	const commands = useCommands()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	// const commandPalette = useSubscription(commandPalette$)

	const onSidebarClick = () => {
		if (!isNarrow || sidebar.disabled || sidebar.sizes[0] === 0) return
		commands.emit<cmd.sidebar.setSize>("sidebar.set-size", [0, 100])
	}

	// const openCommandPalette = () =>
	// 	commandPalette && commands.emit<cmd.commandPalette.show>("command-palette.show", commandPalette)
	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event })

	return (
		<div
			className="flex h-screen w-full flex-col justify-between overflow-y-hidden bg-neutral-200 px-4 py-3 dark:bg-neutral-900"
			onClick={onSidebarClick}
			onContextMenu={showContextMenu}
		>
			{/* <div className="flex flex-col">
				<div className="flex justify-between items-center">
					<img src={`${Hosts.STATIC}/logo.png`} className="w-8" alt="Ordo.pink Logo" />
					<div className="text-2xl cursor-pointer text-neutral-500" onClick={openCommandPalette}>
						<BsThreeDotsVertical />
					</div>
				</div>
			</div> */}

			<div className="my-2 h-full grow overflow-y-auto">{children}</div>

			{/* <div className="flex justify-center items-center space-x-2 w-full">
				<div className="mt-1 flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
					<div className="bg-white rounded-full">
						<Link href="/user">
							<img
								className="h-10 rounded-full"
								src={`${process.env.VITE_ORDO_STATIC_HOST}/logo.png`}
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
			</div> */}
		</div>
	)
}
