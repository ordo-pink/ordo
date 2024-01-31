// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { View } from "./used-space.view"
import { useModel } from "./used-space.model"

export default function UsedSpace() {
	const { currentSize, totalSize } = useModel()

	const progress = `${currentSize} / ${totalSize}`
	const percentage = `${((currentSize / totalSize) * 100).toFixed(0)}%` as const

	return <View progress={progress} progressPercentage={percentage} />
}
