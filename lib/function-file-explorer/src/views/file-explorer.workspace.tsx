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
			className="size-full min-h-[100dvh]"
			onContextMenu={showContextMenu({ commands, payload: currentData ?? "root" })}
		>
			<div className="file-explorer flex w-full flex-wrap p-4">
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
