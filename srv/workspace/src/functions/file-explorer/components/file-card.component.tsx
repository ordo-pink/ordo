// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { File, FileUtils } from "@ordo-pink/datautil"
import FileIconComponent from "./file-icon.component"
import { useSharedContext, cmd } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"

type P = { file: File }
export default function FileCardComponent({ file }: P) {
	const { commands } = useSharedContext()

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.contextMenu.show>("context-menu.show", { event, payload: file })

	return (
		<div onContextMenu={showContextMenu} className="flex flex-col items-center">
			<FileIconComponent file={file} />
			<div>{FileUtils.getReadableName(file.path)}</div>
		</div>
	)
}
