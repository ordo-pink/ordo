// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsCheckCircle, BsLink45Deg, BsTag, BsTextLeft } from "react-icons/bs"
import { useChildren, useCommands, useReadableSize } from "@ordo-pink/frontend-react-hooks"
import { CSS } from "@dnd-kit/utilities"
import { MouseEvent } from "react"
import { useSortable } from "@dnd-kit/sortable"

import { PlainData } from "@ordo-pink/data"

import DataLabel from "@ordo-pink/frontend-react-components/data-label"

type P = { item: PlainData }

const checkIsDone = (item: PlainData | null) => (item && item.labels.includes("done")) || false

export default function GTDItem({ item }: P) {
	const commands = useCommands()
	const children = useChildren(item)
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: item.fsid,
		resizeObserverConfig: {},
	})
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	}
	const readableSize = useReadableSize(item)

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
			className="flex space-x-4 rounded-md bg-neutral-300 p-4 outline-none hover:bg-neutral-300 focus:ring-1 focus:ring-purple-500 md:p-2 dark:bg-neutral-800 dark:hover:bg-neutral-800"
			onContextMenu={onContextMenu}
			tabIndex={0}
		>
			<input
				className="size-6 cursor-pointer rounded-sm bg-neutral-200 text-emerald-500 focus:ring-0 dark:bg-neutral-500"
				type="checkbox"
				checked={isDone}
				id={item.fsid}
				onMouseDown={onCheckboxChange}
				onChange={onCheckboxChange}
				tabIndex={0}
			/>

			<div className="flex w-full justify-between">
				<div className="flex w-full flex-col justify-center space-y-1">
					<div className={isDone ? "text-neutral-500 line-through" : ""}>{item.name}</div>

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
									<span>{readableSize}</span>
								</div>
							</DataLabel>
						) : null}

						{children.length > 0 ? (
							<DataLabel>
								<div
									className={`flex items-center space-x-2 text-xs ${
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
