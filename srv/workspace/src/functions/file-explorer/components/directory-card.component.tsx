// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Directory, DirectoryUtils } from "@ordo-pink/data"
import DirectoryIconComponent from "./directory-icon.component"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"

type P = { directory: Directory }
export default function DirectoryCardComponent({ directory }: P) {
	const { commands } = useSharedContext()

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.contextMenu.show>("context-menu.show", { event, payload: directory })

	return (
		<div className="directory-card flex flex-col items-center" onContextMenu={showContextMenu}>
			<DirectoryIconComponent />
			<div>{DirectoryUtils.getReadableName(directory.path)}</div>
		</div>
	)
}
