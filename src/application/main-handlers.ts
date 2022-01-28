import { ipcMain, Menu, MenuItem } from "electron";
import { registerEventHandlers } from "../common/register-ipc-main-handlers";
import { listFolder } from "./fs/list-folder";
import { readFile } from "./fs/read-file";
import { OpenOrdoFile, OrdoFolder, ApplicationEvent } from "./types";
import { getFile } from "./utils/get-file";
import { promises } from "fs";

import { saveFile } from "./fs/save-file";
import { updateFolder } from "./fs/update-folder";
import { getFolder } from "./utils/get-folder";
import { Colors } from "./appearance/colors/types";

export default registerEventHandlers<ApplicationEvent>({
	"@application/get-state": () => {
		ipcMain.emit("send-state");
	},
	"@application/set-focused-component": ({ draft, payload }) => {
		draft.application.focusedComponent = payload;
	},
	"@application/register-command": ({ draft, payload }) => {
		draft.application.commands.push(payload);
	},
	"@application/close-window": ({ context }) => {
		context.window.close();
	},
	"@application/show-context-menu": ({ payload, transmission, context }) => {
		const tree = transmission.get((s) => s.application.tree);

		if (!tree || !payload) {
			return;
		}

		const menu = new Menu();

		const entity = payload.item === "folder" ? getFolder(tree, payload.params.path) : getFile(tree, payload.params.path);

		if (!entity) {
			return;
		}

		if (payload.item === "folder") {
			menu.append(
				new MenuItem({
					label: "New File",
					accelerator: "CommandOrControl+N",
					click: () => console.log("Booo"),
				}),
			);

			menu.append(
				new MenuItem({
					label: "New Folder",
					accelerator: "CommandOrControl+Shift+N",
					click: () => console.log("Booo"),
				}),
			);

			menu.append(new MenuItem({ type: "separator" }));
		}

		menu.append(
			new MenuItem({
				label: "Reveal in Finder",
				accelerator: "CommandOrControl+Alt+R",
				click: () => console.log("Booo"),
			}),
		);

		if (payload.item === "folder") {
			menu.append(
				new MenuItem({
					label: "Find in Folder",
					accelerator: "CommandOrControl+Shift+F",
					click: () => console.log("Booo"),
				}),
			);
		}

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Cut",
				accelerator: "CommandOrControl+X",
				click: () => console.log("Booo"),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Copy",
				accelerator: "CommandOrControl+C",
				click: () => console.log("Booo"),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Paste",
				accelerator: "CommandOrControl+V",
				click: () => console.log("Booo"),
			}),
		);

		if (payload.item === "folder") {
			const colorOptions = Colors.slice(5).map(
				(color) =>
					new MenuItem({
						label: color,
						type: "radio",
						checked: (entity as any)?.color === color,
						click: () => transmission.emit("@application/update-folder", [entity?.path, { color }]),
					}),
			);

			menu.append(new MenuItem({ type: "separator" }));

			menu.append(
				new MenuItem({
					label: "Color",
					submenu: colorOptions as unknown as Menu,
				}),
			);
		}

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Copy Path",
				accelerator: "CommandOrControl+Option+C",
				click: () => console.log("Booo"),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Copy Relative Path",
				accelerator: "CommandOrControl+Shift+Alt+C",
				click: () => console.log("Booo"),
			}),
		);

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Rename",
				accelerator: "Enter",
				click: () => console.log("Booo"),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Delete",
				accelerator: "CommandOrControl+Backspace",
				click: () => console.log("Booo"),
			}),
		);

		menu.popup({
			window: context.window,
			x: payload.x,
			y: payload.y,
		});
	},
	"@application/toggle-dev-tools": ({ draft, context }) => {
		draft.application.showDevTools = !draft.application.showDevTools;
		context.window.webContents.toggleDevTools();
	},
	"@application/reload-window": ({ context }) => {
		context.window.webContents.reload();
	},
	"@application/open-folder": async ({ draft, context, transmission, payload }) => {
		let filePath: string;

		if (payload) {
			filePath = payload;
		} else {
			const filePaths = context.dialog.showOpenDialogSync(context.window, {
				properties: ["openDirectory", "createDirectory", "promptToCreate"],
			});

			if (!filePaths) {
				return;
			}

			filePath = filePaths[0];
		}

		context.addRecentDocument(filePath);

		transmission.emit("@activity-bar/open-editor");

		draft.application.cwd = filePath;
		draft.application.tree = await listFolder(filePath);
		draft.application.openFiles = [];
		draft.application.currentFile = 0;
		draft.application.currentFilePath = "";
	},
	"@application/open-file": async ({ draft, payload, transmission }) => {
		if (!payload || !draft.application.tree) {
			return;
		}

		transmission.emit("@application/set-focused-component", "editor");

		const alreadyOpen = draft.application.openFiles.findIndex((file) => file.path === payload);

		if (~alreadyOpen) {
			if (draft.application.currentFile !== alreadyOpen) {
				transmission.emit("@application/set-current-file", alreadyOpen);
			}

			return;
		}

		const file = getFile(draft.application.tree, payload as string) as OpenOrdoFile;

		if (!file) {
			return;
		}

		file.body = (await readFile(file)) as unknown as string[][];

		if (file.type === "image") {
			draft.application.openFiles.push(file);
			draft.application.currentFile = draft.application.openFiles.length - 1;
			return;
		}

		file.body = (file.body as unknown as string).split("\n").map((line) => line.split("").concat([" "]));
		file.selection = {
			start: { line: 0, index: 0 },
			end: { line: 0, index: 0 },
			direction: "ltr",
		};

		draft.application.openFiles.push(file);
		draft.application.currentFile = draft.application.openFiles.length - 1;
		draft.application.currentFilePath = draft.application.openFiles[draft.application.currentFile].path;

		transmission.emit("@activity-bar/open-editor");
	},
	"@application/update-folder": ({ draft, payload }) => {
		const [path, increment] = payload;
		updateFolder(draft.application.tree as OrdoFolder, path, increment);
	},
	"@application/set-current-file": ({ draft, payload, transmission }) => {
		draft.application.currentFile = payload;
		draft.application.currentFilePath = draft.application.openFiles[payload].path;
		transmission.emit("@application/set-focused-component", "editor");
	},
	"@application/close-file": ({ draft, payload, context, transmission }) => {
		if (payload == null) {
			payload = draft.application.currentFile;
		}

		if (draft.application.unsavedFiles.includes(draft.application.openFiles[payload].path)) {
			const response = context.dialog.showMessageBoxSync({
				type: "question",
				message: `The file "${draft.application.openFiles[payload].relativePath}" has unsaved changes. Save before closing?`,
				buttons: ["Yes", "No"],
			});

			if (response === 0) {
				transmission.emit("@application/save-file", draft.application.openFiles[payload].path);
			}
		}

		draft.application.openFiles.splice(payload, 1);

		draft.application.currentFile = draft.application.openFiles.length - 1;
		draft.application.currentFilePath = draft.application.openFiles[draft.application.currentFile]?.path || "";
	},
	"@application/save-file": async ({ draft, context, payload }) => {
		const file = payload
			? draft.application.openFiles.find((file) => file.path === payload)
			: draft.application.openFiles[draft.application.currentFile];

		if (!file) {
			return;
		}

		await saveFile(
			file.path,
			file.body
				.map((line) => {
					let str = line.slice(0, -1).join("");

					while (str.endsWith(" ")) {
						str = str.slice(0, -1);
					}

					return str;
				})
				.join("\n"),
		);

		const { size, mtime, atime } = await promises.stat(file.path);

		file.size = size;
		file.updatedAt = mtime;
		file.accessedAt = atime;

		draft.application.unsavedFiles = draft.application.unsavedFiles.filter((f) => f !== file.path);

		if (!draft.application.unsavedFiles.length) {
			context.window.setDocumentEdited(false);
		}
	},
});
