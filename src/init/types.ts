import { BrowserWindow, Dialog } from "electron";

import { AppState, AppEvents } from "@containers/app/types";
import { SideBarState, SideBarEvents } from "@containers/side-bar/types";
import { ActivityBarState, ActivityBarEvents } from "@modules/activity-bar/types";
import { EditorState, EditorEvents } from "@modules/editor/types";
import { FileExplorerState, FileExplorerEvents } from "@modules/file-explorer/types";
import { TopBarState, TopBarEvents } from "@modules/top-bar/types";

export type OrdoEvents = FileExplorerEvents &
	AppEvents &
	SideBarEvents &
	ActivityBarEvents &
	TopBarEvents &
	EditorEvents;

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
