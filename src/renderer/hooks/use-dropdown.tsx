import React from "react"

export function useDropdown<T>(): [React.MutableRefObject<T>, boolean, () => void, () => void] {
	const [isOpen, setIsOpen] = React.useState(false)
	const ref = React.useRef(null)

	const open = React.useCallback(() => setIsOpen(true), [])
	const close = React.useCallback(() => setIsOpen(false), [])

	React.useEffect(() => {
		const handleGlobalMouseDown = ({ target }: MouseEvent) => {
			if (!ref.current || ref.current.contains(target)) {
				return
			}

			close()
		}

		const handleGlobalKeyDown = ({ key }: KeyboardEvent) => (key === "Escape" ? close() : null)

		document.addEventListener("mousedown", handleGlobalMouseDown)
		document.addEventListener("keydown", handleGlobalKeyDown)

		return () => {
			document.removeEventListener("mousedown", handleGlobalMouseDown)
			document.removeEventListener("keydown", handleGlobalKeyDown)
		}
	}, [close])

	return [ref, isOpen, open, close]
}
