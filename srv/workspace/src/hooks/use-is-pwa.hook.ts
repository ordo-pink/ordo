// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"

export const useIsPWA = () => {
	const [isPWA, setIsPWA] = useState()

	useEffect(() => {
		setIsPWA(
			(navigator as any).standalone || window.matchMedia("(display-mode: standalone)").matches,
		)
	}, [])

	return isPWA
}
