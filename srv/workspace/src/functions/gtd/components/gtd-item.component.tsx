// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useChildren } from "$hooks/use-children"
import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { MouseEvent } from "react"
import { BsCheckCircle, BsLink45Deg, BsTag, BsTextLeft } from "react-icons/bs"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DataLabel from "$components/data/label.component"
import { toReadableSize } from "$hooks/use-readable-size.hook"

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
		isDone
			? commands.emit<cmd.gtd.markNotDone>("gtd.mark-not-done", item.fsid)
			: commands.emit<cmd.gtd.markDone>("gtd.mark-done", item.fsid)
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
				<div className="flex flex-col w-full justify-center space-y-1">
					<div className={isDone ? "line-through text-neutral-500" : ""}>{item.name}</div>

					{item.labels.length > 0 ? (
						<div className="flex flex-wrap gap-1">
							{item.labels
								.filter(label => label !== "done")
								.sort((a, b) => a.localeCompare(b))
								.map(label => (
									<DataLabel key={label}>
										<div
											className="flex space-x-1 items-center"
											onMouseDown={event =>
												event.button === 0 &&
												commands.emit<cmd.data.showEditLabelsPalette>(
													"data.show-edit-labels-palette",
													item,
												)
											}
										>
											<BsTag />
											<div>{label}</div>
										</div>
									</DataLabel>
								))}
						</div>
					) : null}

					<div className="flex gap-1 flex-wrap">
						{item.size > 0 ? (
							<DataLabel>
								<div className="flex space-x-1 items-center">
									<BsTextLeft />
									<span>{toReadableSize(item.size)}</span>
								</div>
							</DataLabel>
						) : null}

						{children.length > 0 ? (
							<DataLabel>
								<div
									className={`text-xs flex space-x-2 items-center ${
										doneChildren.length === children.length ? "text-emerald-500" : ""
									}`}
									title={`${doneChildren.length} out of ${children.length} items done. Click to open subproject.`}
									onMouseDown={event =>
										event.button === 0 &&
										commands.emit<cmd.router.navigate>(
											"router.navigate",
											`/gtd/projects/${item.fsid}`,
										)
									}
								>
									<BsCheckCircle />
									<div>
										{doneChildren.length}/{children.length}
									</div>
								</div>
							</DataLabel>
						) : null}

						{item.links.length > 0 ? (
							<DataLabel>
								<div
									className="flex space-x-1 items-center"
									onMouseDown={event =>
										event.button === 0 &&
										commands.emit<cmd.data.showEditLinksPalette>(
											"data.show-edit-links-palette",
											item,
										)
									}
								>
									<BsLink45Deg />
									<span>{item.links.length}</span>
								</div>
							</DataLabel>
						) : null}
					</div>
				</div>
			</div>
		</div>
	)
}
