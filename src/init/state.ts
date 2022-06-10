import { WindowState } from "@init/types";
import notifications from "@modules/notifications/initial-state";
import fileExplorer from "@modules/file-explorer/initial-state";
import activityBar from "@modules/activity-bar/initial-state";
import sideBar from "@containers/side-bar/initial-state";
import topBar from "@modules/top-bar/initial-state";
import editor from "@modules/editor/initial-state";
import app from "@containers/app/initial-state";

export const initialState: WindowState = {
	app,
	fileExplorer,
	activityBar,
	sideBar,
	topBar,
	statusBar: {},
	workspace: {},
	editor,
	notifications,
};
