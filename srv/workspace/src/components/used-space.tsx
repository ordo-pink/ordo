// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { noop } from "@ordo-pink/tau"
import Null from "./null"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"

// const MAX_TOTAL_SIZE_MB = 50

export default function UsedSpace() {
	const { data } = useSharedContext()

	const [percentage, setPercentage] = useState(0)
	const [size, setSize] = useState(0)

	useEffect(() => {
		// Either.fromNullable(data)
		// 	.map(items => items.reduce((acc, item) => acc + Number(item.size), 0))
		// 	.map(size => size / 1024 / 1024)
		// 	.fold(noop, megabytes => {
		// 		setSize(megabytes)
		// 		setPercentage((megabytes / MAX_TOTAL_SIZE_MB) * 100)
		// 	})
		Either.fromNullable(data)
			.map(items => items.length)
			.fold(noop, length => {
				setSize(length)
				setPercentage(length / 10)
			})
	}, [data])

	return Either.fromNullable(data).fold(Null, () => (
		<div className="w-full max-w-sm">
			<div className="flex justify-between items-center w-full">
				<div className="text-xs truncate">File limit</div>
				<div className="text-xs">
					{size.toFixed(0)}
					{"/"}
					{1000}
					{/* {"MB"} */}
				</div>
			</div>
			<div className="w-full bg-neutral-300 rounded-full dark:bg-neutral-700 shadow-inner">
				<div
					className={`bg-gradient-to-r h-1 rounded-full from-slate-500 to-neutral-500`}
					style={{ width: `${percentage.toFixed(0)}%` }}
				/>
			</div>
		</div>
	))
}
