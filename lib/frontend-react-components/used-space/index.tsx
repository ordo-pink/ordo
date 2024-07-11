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

import { useEffect, useState } from "react"

import { Range, get_percentage } from "@ordo-pink/tau"
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
	const percentage = Switch.of(get_percentage(total, current))
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
