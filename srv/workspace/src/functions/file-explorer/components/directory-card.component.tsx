// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import DirectoryIconComponent from "./directory-icon.component"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"

type P = { plain: PlainData }
export default function DirectoryCardComponent({ plain }: P) {
	const { commands } = useSharedContext()

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: plain })

	return (
		<div className="directory-card flex flex-col items-center" onContextMenu={showContextMenu}>
			<DirectoryIconComponent />
			<div>{plain.name}</div>
		</div>
	)
}
