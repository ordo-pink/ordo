import { EventHandler, OrdoEvents } from "../common/types";
import { EventTransmission } from "../event-transmission";

export const registerEventHandlers =
	<T extends Partial<OrdoEvents>>(handlers: { [K in keyof T]: EventHandler<T[K]> }) =>
	(transmission: EventTransmission): void => {
		for (const key in handlers) {
			transmission.on(key as keyof OrdoEvents, (handlers as unknown as Record<string, EventHandler<unknown>>)[key]);
		}
	};
