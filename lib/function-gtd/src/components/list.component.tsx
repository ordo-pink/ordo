// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BsCheckCircle, BsChevronDown, BsChevronUp, BsListCheck } from "react-icons/bs"
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	// arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useEffect, useState } from "react"

import { Switch } from "@ordo-pink/switch"

import { PlainData } from "@ordo-pink/data"

import GTDItem from "./item.component"

type P = { items: PlainData[] }
export default function GTDList({ items }: P) {
	// const commands = useCommands()

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
			<div className="flex size-full flex-col items-center justify-center p-0.5 text-neutral-500">
				<BsListCheck className="text-9xl" />
				<div className="text-sm">Тут пусто. А тут что-нибудь должно быть?</div>
			</div>
		))
		.case(pendingItems.length === 0 && doneItems.length > 0, () => (
			<div className="flex h-full flex-col space-y-2 overflow-y-auto p-0.5">
				<div className="my-8 flex w-full flex-col items-center justify-center space-y-4 text-neutral-500">
					<BsCheckCircle className="text-6xl text-emerald-500" />
					<div className="text-sm">Миссия выполнена! Можно почиллить.</div>
				</div>

				{showDone ? (
					<>
						{hasDoneItems ? (
							<div
								className="flex cursor-pointer items-center justify-center space-x-2 text-center text-sm text-neutral-500"
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
						className="flex cursor-pointer items-center justify-center space-x-2 text-center text-sm text-neutral-500"
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
				<div className="flex flex-col space-y-2 overflow-y-auto p-0.5">
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
									className="flex cursor-pointer items-center justify-center space-x-2 text-center text-sm text-neutral-500"
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
							className="flex cursor-pointer items-center justify-center space-x-2 text-center text-sm text-neutral-500"
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
