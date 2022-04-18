import { BrowserWindow, MenuItem, MenuItemConstructorOptions, shell } from "electron";
import { is } from "electron-util";

export const getTemplateMenu = (createWindow: () => Promise<void>): Array<MenuItemConstructorOptions | MenuItem> =>
	[
		{
			label: "ORDO",
			submenu: [
				{ role: "about" },
				{ type: "separator" },
				{ role: "services" },
				{ type: "separator" },
				{ role: "hide" },
				{ role: "hideOthers" },
				{ role: "unhide" },
				{ type: "separator" },
				{ role: "quit" },
			],
		},
		{
			label: "&File",
			submenu: [
				{
					label: "New Window",
					accelerator: "CommandOrControl+Shift+N",
					click: async () => {
						await createWindow();
					},
				},
				{ type: "separator" },

				{
					label: "Close Window",
					accelerator: "CommandOrControl+Shift+W",
					click: () => {
						BrowserWindow.getFocusedWindow()?.close();
					},
				},
			],
		},
		{
			label: "&View",
			submenu: [
				...(is.development && process.argv.includes("--debug")
					? [{ role: "reload" }, { role: "forceReload" }, { role: "toggleDevTools" }]
					: []),
				{ role: "resetZoom" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ type: "separator" },
				{ role: "togglefullscreen" },
			],
		},
		{
			label: "&Window",
			submenu: [
				{ role: "minimize" },
				{ role: "zoom" },
				...(is.macos
					? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }]
					: [{ role: "close" }]),
			],
		},
		{
			role: "help",
			submenu: [
				{
					label: "Learn More",
					click: async () => {
						await shell.openExternal("https://ordo.pink");
					},
				},
			],
		},
	] as unknown as MenuItem[];
