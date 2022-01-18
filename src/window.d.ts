import type { OrdoEvents } from "./types"

declare global {
	interface Window {
		ordo: {
			emit: (...args: OrdoEvents) => void
		}
	}
}
