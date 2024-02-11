// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"

import { Range, getPercentage } from "@ordo-pink/tau"
import { useData, useUser } from "@ordo-pink/frontend-react-hooks"
import { Switch } from "@ordo-pink/switch"

import { UsedSpaceModel } from "./used-space.model"
import { UsedSpaceView } from "./used-space.view"

/**
 * UsedSpace component renders a progress bar showing how many files the user has compared to how
 * many files they can have in total. This component is only used in the free tier.
 */
export default function UsedSpace() {
	const [current, total] = useUsedSpaceModel()

	const progress = `${current} / ${total}` as const
	const percentage = Switch.of(getPercentage(total, current))
		.case(
			v => v <= 100,
			v => v as Range<0, 101>,
		)
		.default(() => 100 as const)

	return <UsedSpaceView progress={progress} percentage={percentage} />
}

// --- Internal ---

const [initialCurrentSize, initialTotalSize] = UsedSpaceModel.empty()

const useUsedSpaceModel = () => {
	const data = useData()
	const user = useUser()

	const [currentSize, setCurrentSize] = useState(initialCurrentSize)
	const [totalSize, setTotalSize] = useState(initialTotalSize)

	useEffect(() => {
		const [current, total] = UsedSpaceModel.of(data, user)

		setCurrentSize(current)
		setTotalSize(total)
	}, [data, user])

	return [currentSize, totalSize]
}
