// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { noop } from "@ordo-pink/tau"
import Null from "./null"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"

// const MAX_TOTAL_SIZE_MB = 50

export default function UsedSpace() {
	const { data, user } = useSharedContext()

	const [percentage, setPercentage] = useState(0)
	const [size, setSize] = useState(0)

	useEffect(() => {
		Either.fromNullable(data)
			.chain(data => Either.fromNullable(user).map(user => ({ data, user })))
			.fold(noop, ({ data, user }) => {
				setSize(data.length)
				setPercentage((data.length / user.fileLimit) * 100)
			})
	}, [data, user])

	return Either.fromNullable(user).fold(Null, user => (
		<div className="w-full max-w-sm">
			<div className="flex justify-between items-center w-full">
				<div className="text-xs truncate">File limit</div>
				<div className="text-xs">
					{size.toFixed(0)}
					{"/"}
					{user.fileLimit}
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
