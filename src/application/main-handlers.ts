import { ipcMain } from "electron";
import { registerEventHandlers } from "../common/register-ipc-main-handlers";
import { listFolder } from "./fs/list-folder";
import { readFile } from "./fs/read-file";
import { OpenOrdoFile, KeysDown, OrdoFolder, ApplicationEvent } from "./types";
import { getFile } from "./utils/get-file";
import { promises } from "fs";

import { WindowState } from "../common/types";
import { Switch } from "or-else";
import { handleEnter } from "./key-handlers/enter";
import { handleTab } from "./key-handlers/tab";
import { handleTyping } from "./key-handlers/letters";
import { handleArrowUp } from "./key-handlers/arrow-up";
import { handleArrowLeft } from "./key-handlers/arrow-left";
import { handleArrowRight } from "./key-handlers/arrow-right";
import { handleArrowDown } from "./key-handlers/arrow-down";
import { handleBackspace } from "./key-handlers/backspace";
import { saveFile } from "./fs/save-file";
import { updateFolder } from "./fs/update-folder";

const createAccelerator = (keys: KeysDown): string => {
	let combo = "";

	if (keys.ctrlKey || keys.metaKey) {
		combo += "CommandOrControl+";
	}

	if (keys.altKey) {
		combo += "Alt+";
	}

	if (keys.shiftKey) {
		combo += "Shift+";
	}

	combo += keys.key.toUpperCase();

	return combo;
};

const getRegisterredShortcut = (keys: KeysDown, draft: WindowState) => {
	return draft.application.commands.find(({ shortcut }) => shortcut === createAccelerator(keys));
};

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
	"@application/toggle-dev-tools": ({ draft, context }) => {
		draft.application.showDevTools = !draft.application.showDevTools;
		context.window.webContents.toggleDevTools();
	},
	"@application/reload-window": ({ context }) => {
		context.window.webContents.reload();
	},
	"@application/open-folder": async ({ draft, context, transmission }) => {
		const filePaths = context.dialog.showOpenDialogSync(context.window, {
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		});

		if (!filePaths) {
			return;
		}

		transmission.emit("@activity-bar/open-editor");

		draft.application.cwd = filePaths[0];
		draft.application.tree = await listFolder(draft.application.cwd);
	},
	"@application/open-file": async ({ draft, payload, transmission }) => {
		if (!payload || !draft.application.tree) {
			return;
		}

		transmission.emit("@application/set-focused-component", "editor");

		const alreadyOpen = draft.application.openFiles.findIndex((file) => file.path === payload);

		if (~alreadyOpen) {
			if (draft.application.currentFile !== alreadyOpen) {
				draft.application.currentFile = alreadyOpen;
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
		draft.application.currentFilePath = draft.application.openFiles[draft.application.currentFile].path;
		transmission.emit("@application/set-focused-component", "editor");
	},
	"@application/close-file": ({ draft, payload }) => {
		if (payload == null) {
			payload = draft.application.currentFile;
		}

		draft.application.openFiles.splice(payload, 1);

		draft.application.currentFile = draft.application.openFiles.length - 1;
		draft.application.currentFilePath = draft.application.openFiles[draft.application.currentFile]?.path || "";
	},
	"@application/save-file": async ({ draft }) => {
		const file = draft.application.openFiles[draft.application.currentFile];

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
	},
	"@editor/on-key-down": ({ draft, payload }) => {
		const handle = Switch.of(payload.key)
			.case("Dead", (tab: OpenOrdoFile) => tab)
			.case("ArrowUp", handleArrowUp)
			.case("ArrowDown", handleArrowDown)
			.case("ArrowLeft", handleArrowLeft)
			.case("ArrowRight", handleArrowRight)
			.case("Enter", handleEnter)
			.case("Backspace", handleBackspace)
			.case("Tab", handleTab)
			.default(handleTyping);

		handle(draft.application.openFiles[draft.application.currentFile], payload);
	},
	"@editor/on-mouse-up": ({ draft, payload }) => {
		draft.application.openFiles[draft.application.currentFile].selection = payload;
	},
});
