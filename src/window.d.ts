import type { OrdoEvents } from "./common/types";

declare global {
	interface Window {
		ordo: {
			emit: <K extends keyof OrdoEvents>(event: K, arg?: OrdoEvent[K]) => void;
		};
	}
}
