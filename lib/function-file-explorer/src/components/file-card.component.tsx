import { BsFileEarmark, BsLink45Deg, BsTags } from "react-icons/bs"
import { MouseEvent } from "react"

import DataLabel from "@ordo-pink/frontend-react-components/data-label"
import { PlainData } from "@ordo-pink/data"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

type P = { plain: PlainData }
export default function FileCardComponent({ plain }: P) {
	const commands = useCommands()

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: plain })

	return (
		<div
			title={plain.name}
			onContextMenu={showContextMenu}
			className="flex flex-col items-center space-y-1"
		>
			<BsFileEarmark className="size-full" />
			<div className="mt-1 line-clamp-2 break-all text-center text-sm">{plain.name}</div>
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
