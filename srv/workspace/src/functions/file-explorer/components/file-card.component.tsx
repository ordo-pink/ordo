// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import FileIconComponent from "./file-icon.component"
import { useSharedContext } from "@ordo-pink/core"
import { MouseEvent } from "react"
import DataLabel from "$components/data/label.component"
import { BsLink45Deg, BsTags } from "react-icons/bs"

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
			<div className="mt-1 text-sm text-center break-all line-clamp-2">{plain.name}</div>
			<div className="flex space-x-1">
				<DataLabel>
					<div
						className="flex items-center space-x-1 text-xs"
						title={`Метки:\n\n- ${plain.labels.join("\n- ")}`}
						onClick={() =>
							commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", plain)
						}
					>
						<BsTags />
						<p>{plain.labels.length}</p>
					</div>
				</DataLabel>

				<DataLabel>
					<div
						className="flex items-center space-x-1 text-xs"
						title={`Ссылки на файлы:\n\n- ${plain.links.join("\n- ")}`}
						onClick={() =>
							commands.emit<cmd.data.showEditLinksPalette>("data.show-edit-links-palette", plain)
						}
					>
						<BsLink45Deg />
						<p>{plain.links.length}</p>
					</div>
				</DataLabel>
			</div>
		</div>
	)
}
