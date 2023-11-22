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
