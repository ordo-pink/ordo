import produce, { applyPatches, Draft, enablePatches } from "immer";

import { WindowState, WindowContext, OrdoEvents } from "@init/types";

const stateSymbol = Symbol.for("@transmission/state");
const contextSymbol = Symbol.for("@transmission/context");
const handlersSymbol = Symbol.for("@transmission/handlers");

enablePatches();

export type EventHandler<TPayload> = (event: {
	draft: Draft<WindowState>;
	payload: TPayload;
	context: WindowContext;
	transmission: Transmission;
}) => void | Promise<void>;

/**
 * Transmission is the state management engine that allows mirroring state between
 * frontend and backend. It tracks changes made with event handlers, collects patches,
 * and sends them to be applied to the frontend.
 */
export class Transmission {
	private [stateSymbol]: WindowState;
	private [contextSymbol]: WindowContext;
	private [handlersSymbol]: any;

	public constructor(state: WindowState, context: WindowContext, handlers = {}) {
		this[stateSymbol] = state;
		this[contextSymbol] = context;
		this[handlersSymbol] = handlers;
	}

	public select<Selected>(selector: (state: WindowState) => Selected): Selected {
		return selector(this[stateSymbol]);
	}

	public on<
		TCustomEvents extends Record<string, unknown> = {},
		TKey extends keyof (OrdoEvents & TCustomEvents) = keyof (OrdoEvents & TCustomEvents),
	>(key: TKey, handler: EventHandler<(OrdoEvents & TCustomEvents)[TKey]>): Transmission {
		this[handlersSymbol][key] = handler;
		return this;
	}

	public emit<
		TCustomEvents extends Record<string, unknown> = {},
		TKey extends keyof (OrdoEvents & TCustomEvents) = keyof (OrdoEvents & TCustomEvents),
	>(key: TKey, payload: (OrdoEvents & TCustomEvents)[TKey]): Promise<Transmission> {
		return new Promise((resolve, reject) => {
			produce(
				this[stateSymbol],
				async (draft) => {
					try {
						await this[handlersSymbol][key]({
							draft,
							context: this[contextSymbol],
							transmission: this,
							payload,
						});
					} catch (e) {
						const error = e as Error;

						this.emit("@notifications/add", {
							type: "error",
							title: error.name,
							content: error.message,
						});
					}
				},
				(patches) => {
					try {
						if (patches.length) {
							this[stateSymbol] = applyPatches(this[stateSymbol], patches);
							this[contextSymbol].window.webContents.send("@app/apply-patches", patches);
						}

						resolve(this);
					} catch (e) {
						reject(e);
					}
				},
			);
		});
	}
}
