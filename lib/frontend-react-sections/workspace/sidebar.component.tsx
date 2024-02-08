// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// import { BsThreeDotsVertical } from "react-icons/bs"
import { BsThreeDotsVertical } from "react-icons/bs"
import { type MouseEvent } from "react"

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

			<div className="my-2 h-full grow overflow-y-auto">{children}</div>

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
					{/* <div>
						<UsedSpace />
					</div> */}
				</div>
			</div>
		</div>
	)
}
