// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useChildren } from "$hooks/use-children"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { MouseEvent } from "react"
import { GTDCommands } from "../types"
import { BsCheckCircle } from "react-icons/bs"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DataLabel from "$components/data/label.component"

type P = { item: PlainData }

const checkIsDone = (item: Nullable<PlainData>) => (item && item.labels.includes("done")) || false

export default function GTDItem({ item }: P) {
	const { commands } = useSharedContext()
	const children = useChildren(item)
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: item.fsid,
		resizeObserverConfig: {},
	})
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}

	const isDone = checkIsDone(item)
	const doneChildren = children.filter(checkIsDone)

	const onCheckboxChange = () => {
		console.log("HERE")
		isDone
			? commands.emit<GTDCommands.markNotDone>("gtd.mark-not-done", item)
			: commands.emit<GTDCommands.markDone>("gtd.mark-done", item)
	}

	const onContextMenu = (event: MouseEvent<HTMLDivElement>) =>
		commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: item })

	return (
		<div
			ref={setNodeRef}
			{...listeners}
			{...attributes}
			style={style}
			className="flex space-x-4 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-800 p-4 md:p-2 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
			onContextMenu={onContextMenu}
			tabIndex={0}
		>
			<input
				className="h-6 w-6 rounded-sm focus:ring-0 text-emerald-500 bg-neutral-200 dark:bg-neutral-500 cursor-pointer"
				type="checkbox"
				checked={isDone}
				id={item.fsid}
				onMouseDown={onCheckboxChange}
				onChange={onCheckboxChange}
				tabIndex={0}
			/>

			<div className="flex justify-between w-full">
				<div className="flex flex-col w-full justify-center">
					{children.length > 0 && item.labels.length === 0 ? (
						<div className="flex justify-between items-center">
							<div className={isDone ? "line-through text-neutral-500" : ""}>{item.name}</div>
							<div
								className="flex items-center justify-center text-xs shadow-sm rounded-md px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 cursor-pointer"
								title={`${doneChildren.length} out of ${children.length} items done. Click to open subproject.`}
								onClick={() =>
									commands.emit<cmd.router.navigate>("router.navigate", `/gtd/items/${item.fsid}`)
								}
							>
								<div
									className={`text-xs flex space-x-2 items-center ${
										doneChildren.length === children.length
											? "text-emerald-500"
											: "text-neutral-600 dark:text-neutral-400"
									}`}
								>
									<BsCheckCircle />
									<div>
										{doneChildren.length}/{children.length}
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className={isDone ? "line-through text-neutral-500" : ""}>{item.name}</div>
					)}

					{item.labels.length > 0 ? (
						<div className="flex justify-between mt-2 md:mt-1">
							<div className="flex flex-wrap space-x-1">
								{item.labels
									.filter(label => label !== "done")
									.sort((a, b) => a.localeCompare(b))
									.map(label => (
										<DataLabel key={label}>{label}</DataLabel>
									))}
							</div>

							{children.length > 0 ? (
								<div
									className="flex items-center justify-center text-xs shadow-sm rounded-md px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 cursor-pointer"
									title={`${doneChildren.length} out of ${children.length} items done. Click to open subproject.`}
									onClick={() =>
										commands.emit<cmd.router.navigate>("router.navigate", `/gtd/items/${item.fsid}`)
									}
								>
									<div
										className={`text-xs flex space-x-2 items-center ${
											doneChildren.length === children.length
												? "text-emerald-500"
												: "text-neutral-600 dark:text-neutral-400"
										}`}
									>
										<BsCheckCircle />
										<div>
											{doneChildren.length}/{children.length}
										</div>
									</div>
								</div>
							) : (
								""
							)}
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
