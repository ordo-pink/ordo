// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useLayoutEffect, useState } from "react"

export const useWindowSize = (): [number, number] => {
	const [size, setSize] = useState<[number, number]>([0, 0] as const)

	useLayoutEffect(() => {
		const updateSize = () => setSize([window.innerWidth, window.innerHeight])

		document.addEventListener("resize", updateSize)

		updateSize()

		return () => {
			document.removeEventListener("resize", updateSize)
		}
	}, [])

	return size
}
