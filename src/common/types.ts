import { BrowserWindow, Dialog } from "electron";
import { Draft } from "immer";
import { EventTransmission } from "../event-transmission";
import { ApplicationEvent, ApplicationState } from "../application/types";
import { ActivityBarEvent, ActivityBarState } from "../containers/activity-bar/types";
import { CommanderEvent, CommanderState } from "../containers/commander/types";
import { SidebarEvent, SidebarState } from "../containers/sidebar/types";
import { WorkspaceEvent, WorkspaceState } from "../containers/workspace/types";
import { EditorEvent } from "../components/editor/types";

export type OrdoEvents = ApplicationEvent &
	ActivityBarEvent &
	CommanderEvent &
	SidebarEvent &
	WorkspaceEvent &
	EditorEvent;

export type Optional<T> = T | undefined;

export type UnaryFn<T, R> = (x: T) => R;

export type OrdoEvent<T extends string, K extends string, Args = undefined> = Record<`@${T}/${K}`, Args>;

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
};

export type WindowState<T extends Record<string, unknown> = Record<string, unknown>> = {
	application: ApplicationState;
	activities: ActivityBarState;
	commander: CommanderState;
	sidebar: SidebarState;
	workspace: WorkspaceState;
	components: T;
};
