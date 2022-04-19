import { AppState } from "@containers/app/types";
import { SideBarState } from "@containers/side-bar/types";
import { EventHandler } from "@core/transmission";
import { ActivityBarState } from "@modules/activity-bar/types";
import { EditorState } from "@modules/editor/types";
import { FileExplorerState } from "@modules/file-explorer/types";
import { TopBarState } from "@modules/top-bar/types";
import { BrowserWindow, Dialog } from "electron";
import { OrdoEvents } from "./ordo-events";

export type int = number;
export type uint = number;
export type float = number;

export type UnaryFunction<TArgument, TResult> = (arg: TArgument) => TResult;
export type Thunk<TResult> = UnaryFunction<never, TResult>;

export type OrdoEventHandler<TKey extends keyof OrdoEvents> = EventHandler<OrdoEvents[TKey]>;

export type WindowState = {
	app: AppState;
	sideBar: SideBarState;
	statusBar: {};
	workspace: {};
	activityBar: ActivityBarState;
	editor: EditorState;
	fileExplorer: FileExplorerState;
	topBar: TopBarState;
};

export type WindowContext = {
	window: BrowserWindow;
	dialog: Dialog;
	addRecentDocument: (path: string) => void;
	trashItem: (path: string) => Promise<void>;
	showInFolder: (path: string) => void;
	toClipboard: (content: string) => void;
	fromClipboard: () => string;
};
