import { EventHandler, OrdoEvents } from "../common/types";
import { State } from "../state";

export const registerEventHandlers =
	<T extends Partial<OrdoEvents>, U extends Extract<OrdoEvents, T>, K extends keyof U = keyof U>(
		handlers: Record<K, EventHandler<U[K]>>,
	) =>
	(state: State): void => {
		for (const key in handlers) {
			state.on(key, handlers[key]);
		}
	};
