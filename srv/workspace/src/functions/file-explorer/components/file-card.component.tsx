// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import FileIconComponent from "./file-icon.component"
import { useSharedContext, cmd } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"
import DataLabel from "$components/data/label.component"
import { BsTags } from "react-icons/bs"
import { Either } from "@ordo-pink/either"
import Null from "$components/null"

type P = { plain: PlainData }
export default function FileCardComponent({ plain }: P) {
	const { commands } = useSharedContext()

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: plain })

	return (
		<div
			title={plain.name}
			onContextMenu={showContextMenu}
			className="flex flex-col items-center space-y-1"
		>
			<FileIconComponent plain={plain} />
			<div className="text-sm text-center mt-1 line-clamp-1 break-all">{plain.name}</div>
			{Either.fromBoolean(() => plain.labels.length > 0).fold(Null, () => (
				<DataLabel>
					<div
						className="flex items-center space-x-1 text-xs"
						title={`Labels:\n\n- ${plain.labels.join("\n- ")}`}
						onClick={e => {
							e.preventDefault()

							commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", plain)
						}}
					>
						<BsTags />
						<p>{plain.labels.length}</p>
					</div>
				</DataLabel>
			))}
		</div>
	)
}
