import { useEffect, useState } from "react"

export const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState<boolean>(false)

	useEffect(() => {
		setIsMobile(
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		)
	}, [])

	return isMobile
}
