import { EventHandler } from "@core/types";
import { EventTransmission } from "../event-transmission";

export const registerEventHandlers =
	<T extends Partial<OrdoEvent>>(handlers: { [K in keyof T]: EventHandler<T[K]> }) =>
	(transmission: EventTransmission): void => {
		for (const key in handlers) {
			transmission.on(key as keyof OrdoEvent, (handlers as unknown as Record<string, EventHandler<unknown>>)[key]);
		}
	};
