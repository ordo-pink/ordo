import { useEffect, useState } from "react"

export const useIsApple = () => {
	const [isApple, setIsApple] = useState(false)

	useEffect(() => {
		setIsApple(navigator.appVersion.indexOf("Mac") !== -1)
	}, [])

	return isApple
}
