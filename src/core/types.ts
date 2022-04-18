import { BrowserWindow, Dialog } from "electron";
import { Draft } from "immer";

import { EventTransmission } from "../event-transmission";
import { ApplicationState } from "@modules/application/types";
import { ActivityBarState } from "@containers/activity-bar/types";
import { CommanderState } from "@containers/commander/types";
import { SidebarState } from "@containers/sidebar/types";
import { WorkspaceState } from "@containers/workspace/types";

export type Optional<T> = T | undefined;

export type UnaryFn<T, R> = (x: T) => R;

export type OrdoEvent<T extends string = string, K extends string = string, Args = undefined> = Record<
	`@${T}/${K}`,
	Args
>;

export type EventHandler<T> = (event: {
	draft: Draft<WindowState>;
	payload: T;
	context: WindowContext;
	transmission: EventTransmission;
}) => void | Promise<void>;

export type WindowContext = {
	window: BrowserWindow;
	dialog: Dialog;
	addRecentDocument: (path: string) => void;
	trashItem: (path: string) => Promise<void>;
	showInFolder: (path: string) => void;
	toClipboard: (content: string) => void;
	fromClipboard: () => string;
};

export type WindowState<T extends Record<string, unknown> = Record<string, unknown>> = {
	application: ApplicationState;
	activities: ActivityBarState;
	commander: CommanderState;
	sidebar: SidebarState;
	workspace: WorkspaceState;
	components: T;
};
