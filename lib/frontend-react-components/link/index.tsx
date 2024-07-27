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

import { type HTMLProps, type MouseEvent } from "react"

import { use$ } from "@ordo-pink/frontend-react-hooks"

/**
 * Link component is used as a replacement for <a> tag to work well with Ordo router. It supports
 * both internal and external links (just add the `external` prop).
 */
type P = HTMLProps<HTMLAnchorElement> &
	PropsWithChildren<{
		href: string
		class_name?: string
		external?: boolean
		new_tab?: boolean
	}>
export default function Link({
	href,
	children,
	class_name = "",
	external = false,
	new_tab = false,
}: P) {
	const commands = use$.commands()

	const on_click = (event: MouseEvent) => {
		event.preventDefault()

		external
			? commands.emit<cmd.router.open_external>("router.open_external", {
					url: href,
					new_tab,
				})
			: commands.emit<cmd.router.navigate>("router.navigate", href)
	}

	return (
		<a href={href} className={class_name} onClick={on_click}>
			{children}
		</a>
	)
}
