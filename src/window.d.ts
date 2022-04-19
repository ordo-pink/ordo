import { OrdoEvents } from "@init/types";

declare global {
	interface Window {
		ordo: {
			emit: <
				TReturn = void,
				TCustomEvents extends Record<string, unknown> = {},
				TKey extends keyof (TCustomEvents & OrdoEvents) = keyof (OrdoEvents & TCustomEvents),
			>(
				key: TKey,
				payload: (OrdoEvents & TCustomEvents)[TKey],
			) => Promise<TReturn>;
		};
	}
}
