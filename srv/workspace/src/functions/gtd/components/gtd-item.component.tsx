// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useChildren } from "$hooks/use-children"
import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { MouseEvent } from "react"
import { BsCheckCircle, BsLink45Deg, BsTag, BsTextLeft } from "react-icons/bs"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import DataLabel from "$components/data/label.component"
import { toReadableSize } from "$hooks/use-readable-size.hook"

type P = { item: PlainData }

const checkIsDone = (item: PlainData | null) => (item && item.labels.includes("done")) || false

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
			className="flex p-4 space-x-4 rounded-md outline-none bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-800 md:p-2 focus:ring-1 focus:ring-purple-500"
			onContextMenu={onContextMenu}
			tabIndex={0}
		>
			<input
				className="w-6 h-6 text-emerald-500 rounded-sm cursor-pointer focus:ring-0 bg-neutral-200 dark:bg-neutral-500"
				type="checkbox"
				checked={isDone}
				id={item.fsid}
				onMouseDown={onCheckboxChange}
				onChange={onCheckboxChange}
				tabIndex={0}
			/>

			<div className="flex justify-between w-full">
				<div className="flex flex-col justify-center space-y-1 w-full">
					<div className={isDone ? "line-through text-neutral-500" : ""}>{item.name}</div>

					{item.labels.length > 0 ? (
						<div className="flex flex-wrap gap-1">
							{item.labels
								.filter(label => label !== "done")
								.sort((a, b) => a.localeCompare(b))
								.map(label => (
									<DataLabel key={label}>
										<div
											className="flex items-center space-x-1"
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

					<div className="flex flex-wrap gap-1">
						{item.size > 0 ? (
							<DataLabel>
								<div className="flex items-center space-x-1">
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
									className="flex items-center space-x-1"
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
