import { app, BrowserWindow } from "electron";
import { enforceMacOSAppLocation, is, setContentSecurityPolicy } from "electron-util";

import { createWindow } from "@core/window/create-window";

if (require("electron-squirrel-startup")) {
	app.quit();
}

if (!is.development) {
	setContentSecurityPolicy(`
script-src 'self' ordo-app;
img-src * data: file:;
style-src 'unsafe-inline', ordo-app data: file:;
font-src 'self', ordo-app file:;
connect-src 'self', ordo-app;
base-uri 'none';
form-action 'none';
frame-ancestors 'none';
object-src 'none';
`);
} else {
	setContentSecurityPolicy(`img-src * data: file:;`);
}

app.on("ready", async () => {
	enforceMacOSAppLocation();
	await createWindow();
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		await createWindow();
	}
});
