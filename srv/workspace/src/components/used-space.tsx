// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { useMetadata } from "../streams/auth"
import { noop } from "@ordo-pink/tau/mod"
import Null from "./null"

// TODO: Move to user info
const MAX_TOTAL_SIZE_MB = 50

export default function UsedSpace() {
	const metadata = useMetadata()

	const [percentage, setPercentage] = useState(0)
	const [size, setSize] = useState(0)

	useEffect(() => {
		metadata
			.map(items =>
				items.reduce((acc, item) => (typeof item.size === "number" ? acc + item.size : acc), 0)
			)
			.map(size => size / 1024 / 1024)
			.fold(noop, megabytes => {
				setSize(megabytes)
				setPercentage((megabytes / MAX_TOTAL_SIZE_MB) * 100)
			})
	}, [metadata])

	return metadata.fold(Null, metadata => (
		<div className="w-full">
			<div className="flex justify-between items-center w-full">
				<div className="text-xs truncate">Used space</div>
				<div className="text-xs">
					{size.toFixed(0)}
					{"/"}
					{MAX_TOTAL_SIZE_MB}
					{"MB"}
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
