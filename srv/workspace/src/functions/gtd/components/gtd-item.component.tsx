// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"

type P = { item: PlainData }

export default function GTDItem({ item }: P) {
	const { commands, metadata } = useSharedContext()
	const isDone = item.labels.includes("done")
	const children = item.children.map(
		child => metadata?.find(data => data.fsid === child),
	) as PlainData[]
	const doneChildren = children.filter(child => child.labels.includes("done"))

	const handleCheckboxChange = () =>
		isDone
			? commands.emit<cmd.data.removeLabel>("data.remove-label", {
					item: item,
					label: "done",
			  })
			: commands.emit<cmd.data.addLabel>("data.add-label", {
					item: item,
					label: "done",
			  })

	const handleContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.contextMenu.show>("context-menu.show", { event, payload: item })

	return (
		<div
			className="flex space-x-4 bg-neutral-400 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-800 p-4 rounded-md"
			onContextMenu={handleContextMenu}
		>
			<input
				className="h-6 w-6 rounded-sm focus:ring-0 text-emerald-500 bg-neutral-500 cursor-pointer"
				type="checkbox"
				checked={isDone}
				id={item.fsid}
				onChange={handleCheckboxChange}
			/>
			<div className="flex justify-between w-full">
				<div className={isDone ? "line-through text-neutral-500" : ""}>
					<div className="flex flex-col space-y-2">
						<div>{item.name}</div>
						<div className="flex flex-wrap space-x-1">
							{item.labels
								.filter(label => label !== "done")
								.map(label => (
									<div
										className="text-xs text-neutral-500 bg-neutral-900 rounded-md px-1 py-0.5"
										key={label}
									>
										{label}
									</div>
								))}
						</div>
					</div>
				</div>
				<div>
					{item.children.length > 0 ? (
						<div
							className="flex items-center justify-center text-xs shadow-sm rounded-md px-2 py-0.5 bg-neutral-500 dark:bg-neutral-700 cursor-pointer"
							title={`${doneChildren.length} out of ${children.length} items done. Click to open subproject.`}
							onClick={() => alert("TODO")}
						>
							{doneChildren.length}/{children.length}
						</div>
					) : (
						""
					)}
				</div>
			</div>
		</div>
	)
}
