import { BrowserWindow, dialog } from "electron";
import { getSettings } from "../../configuration/settings";

export const openFolder = (window: BrowserWindow): string => {
	const filePaths = dialog.showOpenDialogSync(window, {
		properties: ["openDirectory", "createDirectory", "promptToCreate"],
	});

	getSettings().set("last-window.folder", filePaths[0]);

	return filePaths[0];
};
