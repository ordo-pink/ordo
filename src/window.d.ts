import { TStore } from "@core/utils/store";
import { BrowserWindow, Dialog } from "electron";
import { Draft } from "immer";
import { app } from "electron";

declare global {
	declare interface Window {
		ordo: {
			emit: <E extends OrdoEvent, K extends keyof E, V extends E[K]>(event: K, request: V) => void;
			emit: <E extends OrdoEvent, K extends keyof E>(event: K) => void;
		};
	}

	declare type int = number;
	declare type uint = number;
	declare type float = number;

	declare type OrdoEvent<Scope extends string = string, Name extends string = string, Args extends any = void> = Record<
		`@${Scope}/${Name}`,
		Args
	>;

	declare type OrdoEventRequest<E extends OrdoEvent, Key extends keyof E> = E[Key][0];
	declare type OrdoEventResponse<E extends OrdoEvent, Key extends keyof E> = E[Key][1];

	declare type Optional<T> = T | undefined;
	declare type Nullable<T> = T | null;
	declare type UnaryFunction = <T, R>(x: T) => R;

	declare type GlobalStore = {
		on: <Event extends OrdoEvent, Key extends keyof Event>(key: Key, updateFn: OrdoEventHandler<Event[Key]>) => void;
		get: <Selected>(selector: (state: typeof this.state) => Selected) => Selected;
		emit: <Event extends OrdoEvent, Key extends keyof Event>(key: Key) => void;
		emit: <Event extends OrdoEvent, Key extends keyof Event>(key: Key, payload: Event[Key]) => void;
	};

	declare type Command = {
		id: keyof OrdoEvent;
		name: string;
		description: string;
		accelerator?: string;
	};

	declare type WindowState = {
		commands: Command[];
	};

	declare type WindowContext = {
		window: BrowserWindow;
		dialog: Dialog;
		addRecentDocument: (path: string) => void;
		trashItem: (path: string) => Promise<void>;
		showInFolder: (path: string) => void;
		toClipboard: (content: string) => void;
		fromClipboard: () => string;
		getPath: typeof app.getPath;
	};

	declare type OrdoEventHandler<Payload, State = WindowState> = (event: {
		draft: Draft<State>;
		payload: Payload;
		context: WindowContext;
		store: TStore<OrdoEvent>;
	}) => void | Promise<void>;
}
