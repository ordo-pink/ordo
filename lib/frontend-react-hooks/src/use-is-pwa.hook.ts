// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"

declare global {
	interface Navigator {
		standalone?: boolean
	}
}

export const useIsPWA = () => {
	const [isPWA, setIsPWA] = useState(false)

	useEffect(() => {
		setIsPWA(navigator.standalone || window.matchMedia("(display-mode: standalone)").matches)
	}, [])

	return isPWA
}
