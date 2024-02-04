// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData, FSID } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/core"
import { Dispatch, MouseEventHandler, ReactNode, SetStateAction, useState } from "react"
import FSDataIcon from "./data-icon.component"
import { useChildren } from "$hooks/use-children"
import { useDataFromRouteFSID } from "$hooks/use-data-from-route-fsid"

export default function FileExplorerActivity(): ReactNode {
	const { commands } = useSharedContext()
	const currentData = useDataFromRouteFSID()
	const currentDataChildren = useChildren(currentData ?? "root")

	const [selectedItems, setSelectedItems] = useState<FSID[]>([])

	return (
		<div
			className="w-full h-full min-h-screen"
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
