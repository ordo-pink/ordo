import produce, { applyPatches } from "immer";

export class Store<
	State extends Record<string, unknown>,
	Handlers extends Record<keyof OrdoEvent, OrdoEventHandler<OrdoEvent[keyof OrdoEvent]>> = Record<
		keyof OrdoEvent,
		OrdoEventHandler<OrdoEvent[keyof OrdoEvent]>
	>,
> implements GlobalStore
{
	public constructor(
		private context: WindowContext,
		private state: State & WindowState,
		private handlers: Handlers = {} as Handlers,
	) {}

	public on<Event extends OrdoEvent, Key extends keyof Event>(key: Key, updateFn: OrdoEventHandler<Event[Key]>): void {
		(this.handlers as unknown as Record<Key, OrdoEventHandler<Event[Key]>>)[key] = updateFn;
	}

	public get<Selected>(selector: (state: typeof this.state) => Selected): Selected {
		return selector(this.state);
	}

	public emit<Event extends OrdoEvent, Key extends keyof Event>(key: Key): void;
	public emit<Event extends OrdoEvent, Key extends keyof Event>(key: Key, payload: Event[Key]): void;
	public emit<Event extends OrdoEvent, Key extends keyof Event>(key: Key, payload?: Event[Key]): void {
		produce(
			this.state,
			async (draft) => {
				await (this.handlers as unknown as Record<Key, OrdoEventHandler<Event[Key]>>)[key]({
					draft,
					context: this.context,
					store: this,
					payload: payload as unknown as Event[Key],
				});
			},
			(patches) => {
				this.state = applyPatches(this.state, patches);
				this.context.window.webContents.send("@ordo/update-state", patches);
			},
		);
	}
}

export const createState = <State extends Record<string, unknown>>(
	context: WindowContext,
	state: WindowState & State,
) => new Store<State>(context, state);
