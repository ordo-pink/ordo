import React from "react"

export const useEventListener = <K extends keyof WindowEventMap | string>(
	eventName: K,
	handler: (event: K extends keyof WindowEventMap ? WindowEventMap[K] : CustomEvent) => void,
	element: Window | HTMLElement = window,
): void => {
	// Create a ref that stores handler
	const savedHandler =
		React.useRef<
			(event: K extends keyof WindowEventMap ? WindowEventMap[K] : CustomEvent) => void
		>()

	// Update ref.current value if handler changes.
	// This allows our effect below to always get latest handler ...
	// ... without us needing to pass it in effect deps array ...
	// ... and potentially cause effect to re-run every render.
	React.useEffect(() => {
		savedHandler.current = handler
	}, [handler])

	React.useEffect(
		() => {
			// Make sure element supports addEventListener
			// On
			const isSupported = element && element.addEventListener
			if (!isSupported) return

			// Create event listener that calls handler function stored in ref
			const eventListener = (
				event: K extends keyof WindowEventMap ? WindowEventMap[K] : CustomEvent,
			) => savedHandler.current(event)

			// Add event listener
			element.addEventListener(eventName, eventListener)

			// Remove event listener on cleanup
			return () => {
				element.removeEventListener(eventName, eventListener)
			}
		},
		[eventName, element], // Re-run if eventName or element changes
	)
}
