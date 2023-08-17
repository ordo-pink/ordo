import { useState, useLayoutEffect } from "react"

export const useWindowSize = () => {
	const [size, setSize] = useState([0, 0])

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