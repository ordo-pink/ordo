import { BrowserWindow, Dialog } from "electron";

import { NotificationsEvents, NotificationsState } from "@modules/notifications/types";
import { FileExplorerState, FileExplorerEvents } from "@modules/file-explorer/types";
import { ActivityBarState, ActivityBarEvents } from "@modules/activity-bar/types";
import { SideBarState, SideBarEvents } from "@containers/side-bar/types";
import { TopBarState, TopBarEvents } from "@modules/top-bar/types";
import { EditorState, EditorEvents } from "@modules/editor/types";
import { AppState, AppEvents } from "@containers/app/types";

export type OrdoEvents = FileExplorerEvents &
	AppEvents &
	SideBarEvents &
	ActivityBarEvents &
	TopBarEvents &
	NotificationsEvents &
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
	notifications: NotificationsState;
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
