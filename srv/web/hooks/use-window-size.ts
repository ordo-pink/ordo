import { useState, useLayoutEffect } from "preact/hooks"

export const useWindowSize = () => {
	const [size, setSize] = useState([0, 0])

	useLayoutEffect(() => {
		const updateSize = () => setSize([window.innerWidth, window.innerHeight])

		addEventListener("resize", updateSize)

		updateSize()

		return () => {
			removeEventListener("resize", updateSize)
		}
	}, [])

	return size
}
