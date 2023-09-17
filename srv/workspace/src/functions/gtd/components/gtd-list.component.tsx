// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import GTDItem from "./gtd-item.component"
import { useEffect, useState } from "react"
import { BsCheckCircle, BsChevronDown, BsChevronUp, BsListCheck } from "react-icons/bs"
import { Switch } from "@ordo-pink/switch"

type P = { items: PlainData[] }
export default function GTDList({ items }: P) {
	const [showDone, setShowDone] = useState(false)
	const [hasDoneItems, setHasDoneItems] = useState(false)
	const [doneItems, setDoneItems] = useState<PlainData[]>([])
	const [pendingItems, setPendingItems] = useState<PlainData[]>([])

	useEffect(() => {
		const done = items.filter(item => item.labels.includes("done"))
		const pending = items.filter(item => !item.labels.includes("done"))

		setHasDoneItems(done.length > 0)
		setDoneItems(done.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)))
		setPendingItems(pending.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)))
	}, [items])

	return Switch.of(true)
		.case(pendingItems.length === 0 && doneItems.length === 0, () => (
			<div className="flex flex-col items-center justify-center w-full h-full text-neutral-500">
				<BsListCheck className="text-9xl" />
				<div className="text-sm">
					This list looks empty. Type something in the input to get started!
				</div>
			</div>
		))
		.case(pendingItems.length === 0 && doneItems.length > 0, () => (
			<div className="overflow-y-auto h-full">
				<div className="my-8 space-y-4 flex flex-col items-center justify-center w-full text-neutral-500">
					<BsCheckCircle className="text-6xl text-emerald-500" />
					<div className="text-sm">Quest complete! Congratulations!</div>
				</div>

				{showDone ? (
					<>
						{hasDoneItems ? (
							<div
								className="text-center text-sm text-neutral-500 cursor-pointer flex space-x-2 items-center justify-center"
								onClick={() => setShowDone(v => !v)}
							>
								<BsChevronUp />
								<div>Hide done items</div>
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
						<div>See what was done</div>
					</div>
				) : null}
			</div>
		))
		.default(() => (
			<div className="overflow-y-auto flex flex-col space-y-2">
				{pendingItems
					.filter(child => !child.labels.includes("done"))
					.map(child => (
						<GTDItem key={child.fsid} item={child} />
					))}

				{showDone ? (
					<>
						{hasDoneItems ? (
							<div
								className="text-center text-sm text-neutral-500 cursor-pointer flex space-x-2 items-center justify-center"
								onClick={() => setShowDone(v => !v)}
							>
								<BsChevronUp />
								<div>Hide done items</div>
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
						<div>Show done items</div>
					</div>
				) : null}
			</div>
		))
}
