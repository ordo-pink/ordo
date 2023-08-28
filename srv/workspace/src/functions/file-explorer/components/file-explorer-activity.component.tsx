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
import { useEffect, useState } from "react"
import FileCardComponent from "./file-card.component"
import DirectoryCardComponent from "./directory-card.component"
import { Switch } from "@ordo-pink/switch"

type Path = DirectoryPath | FilePath

export default function FileExplorerActivityComponent({
	commands,
}: Pick<Activity.ComponentProps, "commands">) {
	const { metadata } = useSharedContext()
	const [selectedItems, setSelectedItems] = useState<Path[]>([])

	useEffect(() => {
		commands.emit<cmd.sidebar.enable>("sidebar.enable")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return Either.fromNullable(metadata).fold(Null, items => (
		<div className="container grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 p-4">
			{items
				.filter(item => item.path !== "/")
				.map(item => (
					<div
						key={item.path}
						className={`cursor-pointer select-none p-2 rounded-lg ${
							selectedItems.includes(item.path) ? "bg-neutral-300 dark:bg-neutral-700" : ""
						}`}
						onClick={() =>
							selectedItems.includes(item.path)
								? setSelectedItems([])
								: setSelectedItems([item.path])
						}
						onDoubleClick={() => {
							// TODO: Opening files in Editor
							// TODO: Opening directories in Filer
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
	))
}
