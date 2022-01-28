import { produce, applyPatches } from "immer";

import application from "./application/initial-state";
import commander from "./containers/commander/initial-state";
import sidebar from "./containers/sidebar/initial-state";
import workspace from "./containers/workspace/initial-state";
import activities from "./containers/activity-bar/initial-state";
import { EventHandler, OrdoEvents, WindowContext, WindowState } from "./common/types";

export class EventTransmission<
	T extends Record<string, unknown> = Record<string, unknown>,
	H extends Record<keyof OrdoEvents, EventHandler<OrdoEvents[keyof OrdoEvents]>> = Record<
		keyof OrdoEvents,
		EventHandler<OrdoEvents[keyof OrdoEvents]>
	>,
> {
	private state: WindowState;
	private context: WindowContext;
	private handlers: H = {} as H;

	public constructor(context: WindowContext, components: T = {} as T) {
		this.state = {
			application,
			commander,
			sidebar,
			workspace,
			activities,
			components,
		};

		this.context = context;
	}

	public on<T extends OrdoEvents, K extends keyof T>(key: K, updateFn: EventHandler<T[K]>): void {
		(this.handlers as unknown as Record<K, EventHandler<T[K]>>)[key] = updateFn;
	}

	public get<Selected>(selector: (state: typeof this.state) => Selected): Selected {
		return selector(this.state);
	}

	public emit<T extends OrdoEvents, K extends keyof T>(key: K, payload?: T[K]): void {
		produce(
			this.state,
			async (draft) => {
				await (this.handlers as unknown as Record<K, EventHandler<T[K]>>)[key]({
					draft,
					context: this.context,
					transmission: this,
					payload: payload as unknown as T[K],
				});
			},
			(patches) => {
				this.state = applyPatches(this.state, patches);
				this.context.window.webContents.send("apply-state-patches", patches);
			},
		);
	}
}
