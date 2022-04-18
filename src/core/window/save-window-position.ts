import { internalSettingsStore } from "@core/settings/internal-settings";
import { BrowserWindow } from "electron";

export const saveWindowPosition = (window: BrowserWindow) => () => {
	const [x, y] = window.getPosition();
	const [width, height] = window.getSize();

	internalSettingsStore.set("window.width", width);
	internalSettingsStore.set("window.height", height);
	internalSettingsStore.set("window.position.x", x);
	internalSettingsStore.set("window.position.y", y);
};
