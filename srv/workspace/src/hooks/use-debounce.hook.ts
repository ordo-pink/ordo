import { useEffect, useState } from "react"

export const useDebouncedValue = <T>(value: T, delay = 300) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay)
		return () => clearTimeout(timer)
	}, [value])

	return debouncedValue
}
