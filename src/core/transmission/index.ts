import produce, { applyPatches, Draft, enablePatches, Patch } from "immer";

import { WindowState, WindowContext, OrdoEvents } from "@init/types";

const stateSymbol = Symbol.for("@transmission/state");
const contextSymbol = Symbol.for("@transmission/context");
const handlersSymbol = Symbol.for("@transmission/handlers");
const versionSymbol = Symbol.for("@transmission/version");
const changesSymbol = Symbol.for("@transmission/changes");

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
	private [versionSymbol]: number;
	private [changesSymbol]: { redo: Patch[]; undo: Patch[] }[];

	public constructor(state: WindowState, context: WindowContext, handlers = {}) {
		this[stateSymbol] = state;
		this[contextSymbol] = context;
		this[handlersSymbol] = handlers;
		this[versionSymbol] = -1;
		this[changesSymbol] = [];
	}

	public select<Selected>(selector: (state: WindowState) => Selected): Selected {
		return selector(this[stateSymbol]);
	}

	public on<
		TCustomEvents extends Record<string, unknown> = {},
		TKey extends keyof (OrdoEvents & TCustomEvents) = keyof (OrdoEvents & TCustomEvents),
	>(key: TKey, handler: EventHandler<(OrdoEvents & TCustomEvents)[TKey]>): Transmission {
		const undoableEvents = [
			"@editor/toggle-todo",
			"@editor/handle-typing",
			"@editor/close-tab",
			"@file-explorer/move",
			"@file-explorer/replace-line",
			"@file-explorer/set-folder-color",
		];

		const undoable = undoableEvents.includes(key as any);

		this[handlersSymbol][key] = { handler, undoable };

		return this;
	}

	public undo() {
		if (this[versionSymbol] < 0) return;

		const changes = this[changesSymbol][this[versionSymbol]];
		this[versionSymbol]--;

		if (!changes || !changes.undo) return;

		applyPatches(this[stateSymbol], changes.undo);
		this[contextSymbol].window.webContents.send("@app/apply-patches", changes.undo);
	}

	public redo() {
		if (this[versionSymbol] >= this[changesSymbol].length - 1) return;

		this[versionSymbol]++;
		const changes = this[changesSymbol][this[versionSymbol]];

		if (!changes || !changes.redo) return;

		applyPatches(this[stateSymbol], changes.redo);
		this[contextSymbol].window.webContents.send("@app/apply-patches", changes.redo);
	}

	public emit<
		TCustomEvents extends Record<string, unknown> = {},
		TKey extends keyof (OrdoEvents & TCustomEvents) = keyof (OrdoEvents & TCustomEvents),
	>(key: TKey, payload: (OrdoEvents & TCustomEvents)[TKey] = { undoable: false } as any): Promise<Transmission> {
		return new Promise((resolve, reject) => {
			produce(
				this[stateSymbol],
				async (draft) => {
					try {
						await this[handlersSymbol][key].handler({
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
				(patches, inversePatches) => {
					try {
						if (patches.length) {
							this[stateSymbol] = applyPatches(this[stateSymbol], patches);
							this[contextSymbol].window.webContents.send("@app/apply-patches", patches);

							if (this[handlersSymbol][key].undoable) {
								this[versionSymbol] += 1;
								this[changesSymbol].length = this[versionSymbol] >= 0 ? this[versionSymbol] : 0;
								this[changesSymbol][this[versionSymbol]] = {
									redo: patches,
									undo: inversePatches,
								};
							}
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
