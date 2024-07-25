import { useEffect, useState } from "react"

export const useIsMobile = () => {
	const [is_mobile, set_is_mobile] = useState(false)

	useEffect(() => {
		set_is_mobile(
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		)
	}, [])

	return is_mobile
}
