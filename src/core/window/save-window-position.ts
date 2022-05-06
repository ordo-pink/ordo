import { BrowserWindow } from "electron";

import { internalSettingsStore } from "@core/settings/internal-settings";

export const saveWindowPosition = (window: BrowserWindow) => () => {
	const [x, y] = window.getPosition();
	const [width, height] = window.getSize();

	internalSettingsStore.set("window.width", width);
	internalSettingsStore.set("window.height", height);
	internalSettingsStore.set("window.position.x", x);
	internalSettingsStore.set("window.position.y", y);
};
