import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from "react"

import { FSID, PlainData } from "@ordo-pink/data"
import { useChildren, useCommands, useDataFromRouteFSID } from "@ordo-pink/frontend-react-hooks"

import FSDataIcon from "../components/data-icon.component"

export default function FileExplorerActivity() {
	const commands = useCommands()
	const currentData = useDataFromRouteFSID()
	const currentDataChildren = useChildren(currentData ?? "root")

	const [selectedItems, setSelectedItems] = useState<FSID[]>([])

	useEffect(() => {
		commands.emit<cmd.application.setTitle>(
			"application.set-title",
			currentData ? `${currentData.name} | Файлы` : "Файлы",
		)
	}, [currentData, commands])

	return (
		<div
			className="min-h-screen size-full"
			onContextMenu={showContextMenu({ commands, payload: currentData ?? "root" })}
		>
			<div className="flex flex-wrap p-4 w-full file-explorer">
				{currentDataChildren.map(item => (
					<FSDataIcon
						key={item.fsid}
						data={item}
						isSelected={selectedItems.includes(item.fsid)}
						onSelect={handleSelectData({ items: selectedItems, setItems: setSelectedItems })}
					/>
				))}
			</div>
		</div>
	)
}

type ShowContextMenuParams = {
	commands: Client.Commands.Commands
	payload: "root" | PlainData | null
}
type ShowContextMenuFn = (params: ShowContextMenuParams) => MouseEventHandler<HTMLDivElement>
const showContextMenu: ShowContextMenuFn =
	({ commands, payload }) =>
	event =>
		payload && commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload })

type HandleSelectDataParams = { setItems: Dispatch<SetStateAction<FSID[]>>; items: FSID[] }
type HandleSelectData = (params: HandleSelectDataParams) => (fsid: FSID) => void
const handleSelectData: HandleSelectData =
	({ setItems, items }) =>
	fsid =>
		items.includes(fsid) ? setItems([]) : setItems([fsid])
