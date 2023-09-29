// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import { PlainData, FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { Activity, cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent, useEffect, useState } from "react"
import FileCardComponent from "./file-card.component"
import DirectoryCardComponent from "./directory-card.component"
import { Switch } from "@ordo-pink/switch"
import { Nullable } from "@ordo-pink/tau"

export default function FileExplorerActivityComponent({
	commands,
}: Pick<Activity.ComponentProps, "commands">) {
	const { data, route } = useSharedContext()
	const [selectedItems, setSelectedItems] = useState<FSID[]>([])
	const [currentDirectory, setCurrentDirectory] = useState<Nullable<PlainData>>(null)

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: currentDirectory })

	useEffect(() => {
		Switch.of(true)
			.case(!route || !data, () => setCurrentDirectory(null))
			.case(route!.path === "/fs", () =>
				Either.fromNullable(data).fold(
					() => setCurrentDirectory(null),
					root => setCurrentDirectory(null),
				),
			)
			.default(() =>
				Either.fromNullable(data)
					.chain(items =>
						Either.fromNullable(items.find(item => item.fsid === route!.path.slice(4))),
					)
					.fold(
						() => setCurrentDirectory(null),
						root => setCurrentDirectory(root),
					),
			)
	}, [data, route])

	return Either.fromNullable(data).fold(Null, items => (
		<div className="h-full w-full" onContextMenu={showContextMenu}>
			<div className="file-explorer w-full container grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
				{items
					.filter(item =>
						currentDirectory ? item.parent === currentDirectory.fsid : item.parent === null,
					)
					.map(item => (
						<div
							key={item.fsid}
							className={`cursor-pointer max-h-min select-none p-2 rounded-lg ${
								selectedItems.includes(item.fsid) ? "bg-neutral-300 dark:bg-neutral-700" : ""
							}`}
							onClick={() =>
								selectedItems.includes(item.fsid)
									? setSelectedItems([])
									: setSelectedItems([item.fsid])
							}
							onDoubleClick={() => {
								if (item.children.length)
									return commands.emit<cmd.router.navigate>("router.navigate", `/fs/${item.fsid}`)
								alert("TODO")
							}}
						>
							{Switch.of(item)
								.case(
									item => item.children.length > 0,
									() => <DirectoryCardComponent plain={item} />,
								)
								.case(
									item => item.children.length === 0,
									() => <FileCardComponent plain={item} />,
								)
								.default(Null)}
						</div>
					))}
			</div>
		</div>
	))
}
