// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { MouseEvent, PropsWithChildren, HTMLProps } from "react"
import { useSharedContext } from "@ordo-pink/frontend-core"

/**
 * Link component is used as a replacement for <a> tag to work well with Ordo router. It supports
 * both internal and external links (just add the `external` prop).
 */
type P = HTMLProps<HTMLAnchorElement> &
	PropsWithChildren<{ href: string; className?: string; external?: boolean; newTab?: boolean }>
export default function Link({
	href,
	children,
	className = "",
	external = false,
	newTab = false,
}: P) {
	const { commands } = useSharedContext()

	const handleClick = (event: MouseEvent) => {
		event.preventDefault()

		external
			? commands.emit<cmd.router.openExternal>("router.open-external", { url: href, newTab })
			: commands.emit<cmd.router.navigate>("router.navigate", href)
	}

	return (
		<a href={href} className={className} onClick={handleClick}>
			{children}
		</a>
	)
}
