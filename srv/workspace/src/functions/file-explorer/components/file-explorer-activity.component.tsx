// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import {
	Directory,
	DirectoryPath,
	DirectoryUtils,
	File,
	FilePath,
	FileUtils,
} from "@ordo-pink/datautil"
import { Either } from "@ordo-pink/either"
import { Activity, cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent, useEffect, useState } from "react"
import FileCardComponent from "./file-card.component"
import DirectoryCardComponent from "./directory-card.component"
import { Switch } from "@ordo-pink/switch"
import { Nullable } from "@ordo-pink/tau"

type Path = DirectoryPath | FilePath

export default function FileExplorerActivityComponent({
	commands,
}: Pick<Activity.ComponentProps, "commands">) {
	const { metadata, currentRoute } = useSharedContext()
	const [selectedItems, setSelectedItems] = useState<Path[]>([])
	const [currentDirectory, setCurrentDirectory] = useState<Nullable<Directory>>(null)

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.contextMenu.show>("context-menu.show", { event, payload: currentDirectory })

	useEffect(() => {
		Switch.of(true)
			.case(!currentRoute || !metadata, () => setCurrentDirectory(null))
			.case(currentRoute!.path === "/fs", () =>
				Either.fromNullable(metadata)
					.chain(items => Either.fromNullable(items.find(item => item.path === "/")))
					.fold(
						() => setCurrentDirectory(null),
						root => setCurrentDirectory(root as Directory),
					),
			)
			.default(() =>
				Either.fromNullable(metadata)
					.chain(items =>
						Either.fromNullable(items.find(item => item.path === currentRoute!.path.slice(3))),
					)
					.fold(
						() => setCurrentDirectory(null),
						root => setCurrentDirectory(root as Directory),
					),
			)
	}, [metadata, currentRoute])

	useEffect(() => {
		commands.emit<cmd.sidebar.enable>("sidebar.enable")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return Either.fromNullable(currentDirectory)
		.chain(dir =>
			Either.fromNullable(metadata).map(items => DirectoryUtils.getDirectChildren(items, dir)),
		)

		.fold(Null, items => (
			<div className="h-full w-full" onContextMenu={showContextMenu}>
				<div className="file-explorer w-full container grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
					{items
						.filter(item => item.path !== "/")
						.map(item => (
							<div
								key={item.path}
								className={`cursor-pointer max-h-min select-none p-2 rounded-lg ${
									selectedItems.includes(item.path) ? "bg-neutral-300 dark:bg-neutral-700" : ""
								}`}
								onClick={() =>
									selectedItems.includes(item.path)
										? setSelectedItems([])
										: setSelectedItems([item.path])
								}
								onDoubleClick={() => {
									if (DirectoryUtils.isDirectory(item))
										return commands.emit<cmd.router.navigate>("router.navigate", `/fs${item.path}`)
									alert("TODO")
								}}
							>
								{Switch.of(item)
									.case(DirectoryUtils.isDirectory, () => (
										<DirectoryCardComponent directory={item as Directory} />
									))
									.case(FileUtils.isFile, () => <FileCardComponent file={item as File} />)
									.default(Null)}
							</div>
						))}
				</div>
			</div>
		))
}
