// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { MouseEvent, PropsWithChildren, HTMLProps } from "react"
import { getCommands } from "$streams/commands"
import { cmd } from "@ordo-pink/libfe/mod"

const commands = getCommands()

type _P = HTMLProps<HTMLAnchorElement> &
	PropsWithChildren<{
		href: string
		className?: string
		external?: boolean
		newTab?: boolean
	}>

export default function Link({ href, children, className, external = false, newTab = false }: _P) {
	const handleClick = (event: MouseEvent) => {
		event.preventDefault()

		external
			? commands.emit<cmd.router.openExternal>("router.open-external", { url: href })
			: commands.emit<cmd.router.navigate>("router.navigate", href)
	}

	return (
		<a href={href} className={className} onClick={handleClick}>
			{children}
		</a>
	)
}
