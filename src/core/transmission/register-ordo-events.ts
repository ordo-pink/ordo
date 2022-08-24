import { Transmission, EventHandler } from "@core/transmission";
import { OrdoEvents } from "@init/types";

/**
 * Triggers registering a list of provided events at app launch. These
 * events can be triggered by dispatching with useAppDispatch.
 */
export const registerEvents =
  <TCustomEvents = null>(handlers: {
    [K in keyof Partial<TCustomEvents extends null ? OrdoEvents : TCustomEvents>]: EventHandler<
      (TCustomEvents extends null ? OrdoEvents : TCustomEvents)[K]
    >;
  }) =>
  (transmission: Transmission) => {
    for (const key in handlers) {
      transmission.on(key as any, (handlers as any)[key]);
    }
  };
