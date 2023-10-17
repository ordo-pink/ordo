// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import { PlainData, FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { Extensions, cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent, useEffect, useState } from "react"
import { Switch } from "@ordo-pink/switch"
import FSDataIcon from "./data-icon.component"

export default function FileExplorerActivityComponent({
	commands,
}: Pick<Extensions.ComponentProps, "commands">) {
	const { data, route } = useSharedContext()
	const [selectedItems, setSelectedItems] = useState<FSID[]>([])
	const [currentItem, setCurrentItem] = useState<PlainData | null>(null)

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: currentItem })

	useEffect(() => {
		Switch.of(true)
			.case(!route || !data, () => setCurrentItem(null))
			.case(route!.path === "/fs", () => setCurrentItem(null))
			.default(() =>
				Either.fromNullable(data)
					.chain(items =>
						Either.fromNullable(items.find(item => item.fsid === route!.path.slice(4))),
					)
					.fold(
						() => setCurrentItem(null),
						root => setCurrentItem(root),
					),
			)
	}, [data, route])

	return Either.fromNullable(data).fold(Null, items => (
		<div className="h-full w-full" onContextMenu={showContextMenu}>
			<div className="file-explorer w-full container grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 p-4">
				{items
					.filter(item => (currentItem ? item.parent === currentItem.fsid : item.parent === null))
					.map(item => (
						<FSDataIcon
							key={item.fsid}
							data={item}
							isSelected={selectedItems.includes(item.fsid)}
							onSelect={fsid =>
								selectedItems.includes(fsid) ? setSelectedItems([]) : setSelectedItems([fsid])
							}
						/>
					))}
			</div>
		</div>
	))
}
