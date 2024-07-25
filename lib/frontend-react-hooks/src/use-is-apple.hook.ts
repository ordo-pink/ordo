import { useEffect, useState } from "react"

export const useIsApple = () => {
	const [is_apple, set_is_apple] = useState(false)

	useEffect(() => {
		set_is_apple(navigator.appVersion.indexOf("Mac") !== -1)
	}, [])

	return is_apple
}
