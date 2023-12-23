// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"

export const useDebouncedValue = <T>(value: T, delay = 300) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay)
		return () => clearTimeout(timer)
	}, [value])

	return debouncedValue
}
