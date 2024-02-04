// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import GTDItem from "./gtd-item.component"
import { useEffect, useState } from "react"
import { BsCheckCircle, BsChevronDown, BsChevronUp, BsListCheck } from "react-icons/bs"
import { Switch } from "@ordo-pink/switch"
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	// arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
// import { useSharedContext } from "@ordo-pink/core"

type P = { items: PlainData[] }
export default function GTDList({ items }: P) {
	// const { commands } = useSharedContext()

	const [showDone, setShowDone] = useState(false)
	const [hasDoneItems, setHasDoneItems] = useState(false)
	const [doneItems, setDoneItems] = useState<PlainData[]>([])
	const [pendingItems, setPendingItems] = useState<PlainData[]>([])

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	useEffect(() => {
		const done = items.filter(item => item.labels.includes("done"))
		const pending = items.filter(item => !item.labels.includes("done"))

		setHasDoneItems(done.length > 0)
		setDoneItems(done.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)))
		setPendingItems(pending)
	}, [items])

	return Switch.of(true)
		.case(pendingItems.length === 0 && doneItems.length === 0, () => (
			<div className="flex flex-col items-center justify-center w-full h-full text-neutral-500 p-0.5">
				<BsListCheck className="text-9xl" />
				<div className="text-sm">Тут пусто. А тут что-нибудь должно быть?</div>
			</div>
		))
		.case(pendingItems.length === 0 && doneItems.length > 0, () => (
			<div className="overflow-y-auto h-full p-0.5 flex flex-col space-y-2">
				<div className="my-8 space-y-4 flex flex-col items-center justify-center w-full text-neutral-500">
					<BsCheckCircle className="text-6xl text-emerald-500" />
					<div className="text-sm">Миссия выполнена! Можно почиллить.</div>
				</div>

				{showDone ? (
					<>
						{hasDoneItems ? (
							<div
								className="text-center text-sm text-neutral-500 cursor-pointer flex space-x-2 items-center justify-center"
								onClick={() => setShowDone(v => !v)}
							>
								<BsChevronUp />
								<div>Скрыть содеянное</div>
							</div>
						) : null}

						{doneItems.map(child => (
							<GTDItem key={child.fsid} item={child} />
						))}
					</>
				) : hasDoneItems ? (
					<div
						className="text-center text-sm text-neutral-500 cursor-pointer flex space-x-2 items-center justify-center"
						onClick={() => setShowDone(v => !v)}
					>
						<BsChevronDown />
						<div>Показать выполненное</div>
					</div>
				) : null}
			</div>
		))
		.default(() => (
			<DndContext
				onDragEnd={({ active, over }) => {
					if (!active || !over || active.id === over.id) return

					// const fsids = pendingItems.map(data => data.fsid)

					// const oldIndex = fsids.indexOf(active.id as FSID)
					// const newIndex = fsids.indexOf(over.id as FSID)

					// const updatedChildren = arrayMove(pendingItems, oldIndex, newIndex)

					// commands.emit<cmd.data.setChildOrder>("data.set-child-order", {
					// 	fsid,
					// 	children: updatedChildren
					// 		.map(child => child.fsid)
					// 		.concat(doneItems.map(child => child.fsid)),
					// })
				}}
				sensors={sensors}
				collisionDetection={closestCenter}
			>
				<div className="overflow-y-auto flex flex-col space-y-2 p-0.5">
					<SortableContext
						items={pendingItems.map(item => item.fsid)}
						strategy={verticalListSortingStrategy}
					>
						{pendingItems.map(child => (
							<GTDItem key={child.fsid} item={child} />
						))}
					</SortableContext>

					{showDone ? (
						<>
							{hasDoneItems ? (
								<div
									className="text-center text-sm text-neutral-500 cursor-pointer flex space-x-2 items-center justify-center"
									onClick={() => setShowDone(v => !v)}
								>
									<BsChevronUp />
									<div>Скрыть содеянное</div>
								</div>
							) : null}

							{doneItems.map(child => (
								<GTDItem key={child.fsid} item={child} />
							))}
						</>
					) : hasDoneItems ? (
						<div
							className="text-center text-sm text-neutral-500 cursor-pointer flex space-x-2 items-center justify-center"
							onClick={() => setShowDone(v => !v)}
						>
							<BsChevronDown />
							<div>Показать выполненное</div>
						</div>
					) : null}
				</div>
			</DndContext>
		))
}
