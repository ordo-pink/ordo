import type { OrdoEvents } from "./common/types"

declare global {
	interface Window {
		ordo: {
			emit: (...args: OrdoEvents) => void
		}
	}
}
