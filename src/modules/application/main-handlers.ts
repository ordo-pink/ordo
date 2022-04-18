import { promises } from "fs";
import { ipcMain, Menu, MenuItem } from "electron";
import YAML from "yaml";
import { current } from "immer";

import { registerEventHandlers } from "@core/register-ipc-main-handlers";
import { listFolder } from "@core/fs/list-folder";
import { readFile } from "@core/fs/read-file";
import { OpenOrdoFile, OrdoFolder, ApplicationEvent, OrdoFile } from "@modules/application/types";
import { getFile } from "@core/utils/get-file";
import { saveFile } from "@core/fs/save-file";
import { updateFolder } from "@core/fs/update-folder";
import { getFolder } from "@core/utils/get-folder";
import { Colors } from "@core/appearance/colors/types";
import { getParent } from "@core/utils/get-parent";
import { createFile } from "@core/fs/create-file";
import { createFolder } from "@core/fs/create-folder";

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
	"@application/reveal-in-finder": ({ context, transmission, payload }) => {
		const currentFilePath = payload ? payload : transmission.get((state) => state.application.currentFilePath);
		context.showInFolder(currentFilePath);
	},
	"@application/show-file-creation": ({ draft, payload, transmission }) => {
		if (!draft.application.tree) {
			return;
		}

		const path = payload
			? payload
			: draft.application.currentFilePath
			? getParent(draft.application.tree, draft.application.currentFilePath)?.path
			: draft.application.tree.path;

		if (!path) {
			return;
		}

		const folder = getFolder(draft.application.tree, path);

		if (folder?.collapsed) {
			transmission.emit("@application/update-folder", [path, { collapsed: false }]);
		}

		draft.application.focusedComponent = "Sidebar";
		draft.application.createFileIn = path;
	},
	"@application/save-props": async ({ draft, payload }) => {
		const frontmatter = payload.reduce(
			(acc, prop) => ({
				...acc,
				[prop.key]: prop.value,
			}),
			{},
		);

		const currentFile = draft.application.openFiles[draft.application.currentFile];

		if (!currentFile) {
			return;
		}

		currentFile.frontmatter = frontmatter;

		await saveFile(currentFile);
	},
	"@application/show-folder-creation": ({ draft, payload, transmission }) => {
		if (!draft.application.tree) {
			return;
		}

		const path = payload
			? payload
			: draft.application.currentFilePath
			? getParent(draft.application.tree, draft.application.currentFilePath)?.path
			: draft.application.tree.path;

		if (!path) {
			return;
		}

		const folder = getFolder(draft.application.tree, path);

		if (folder?.collapsed) {
			transmission.emit("@application/update-folder", [path, { collapsed: false }]);
		}

		draft.application.focusedComponent = "Sidebar";
		draft.application.createFolderIn = path;
	},
	"@application/hide-creation": ({ draft }) => {
		draft.application.createFileIn = undefined;
		draft.application.createFolderIn = undefined;
		draft.application.focusedComponent = "Editor";
	},
	"@application/create-file": async ({ draft, payload, transmission }) => {
		if (!draft.application.tree || !draft.application.createFileIn) {
			return;
		}

		await createFile(draft.application.tree, draft.application.createFileIn, payload);
		transmission.emit("@application/hide-creation");
	},
	"@application/create-folder": async ({ draft, payload, transmission }) => {
		if (!draft.application.tree || !draft.application.createFolderIn) {
			return;
		}

		await createFolder(draft.application.tree, draft.application.createFolderIn, payload);
		transmission.emit("@application/hide-creation");
	},
	"@application/delete": ({ draft, transmission, context, payload }) => {
		const path = payload
			? payload
			: transmission.get((state) => state.application.openFiles[state.application.currentFile].path);
		const tree = draft.application.tree;

		if (!tree || !path) {
			return;
		}

		const isOpen = draft.application.openFiles.findIndex((item) => item.path === path);

		if (~isOpen) {
			transmission.emit("@application/close-file", isOpen);
		}

		let entity = getFile(tree, path);

		if (!entity) {
			entity = getFolder(tree, path) as unknown as OrdoFile;
		}

		if (!entity) {
			return;
		}

		const response = context.dialog.showMessageBoxSync({
			type: "question",
			buttons: ["Yes", "No"],
			message: `Are you sure you want to delete "${entity.relativePath}"?`,
		});

		if (response === 0) {
			const isOpen = transmission
				.get((state) => state.application.openFiles)
				.findIndex((f) => f.path === (entity as any).path);

			if (isOpen) {
				transmission.emit("@application/close-file", isOpen);
			}

			context.trashItem(entity.path);

			const parent = getParent(tree, entity.path);

			if (!parent) {
				return;
			}

			parent.children = parent?.children.filter((child) => child.path !== (entity as any).path);
			draft.application.unsavedFiles = draft.application.unsavedFiles.filter((file) => file !== (entity as any).path);
		}
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
					click: () => transmission.emit("@application/show-file-creation", payload.params.path),
				}),
			);

			menu.append(
				new MenuItem({
					label: "New Folder",
					accelerator: "CommandOrControl+Shift+N",
					click: () => transmission.emit("@application/show-folder-creation", payload.params.path),
				}),
			);

			menu.append(new MenuItem({ type: "separator" }));
		}

		menu.append(
			new MenuItem({
				label: "Reveal in Finder",
				accelerator: "CommandOrControl+Alt+R",
				click: () => transmission.emit("@application/reveal-in-finder", entity.path),
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

		if (payload.item === "folder") {
			const colorOptions = Colors.slice(5).map(
				(color) =>
					new MenuItem({
						label: color[0].toUpperCase() + color.slice(1),
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
				click: () => transmission.emit("@application/copy-path", entity.path),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Copy Relative Path",
				accelerator: "CommandOrControl+Shift+Alt+C",
				click: () => transmission.emit("@application/copy-relative-path", entity.path),
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
				click: () => transmission.emit("@application/delete", entity.path),
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
	"@application/open-file": async ({ draft, payload, transmission, context }) => {
		if (!payload || !draft.application.tree) {
			return;
		}

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

		const contents = await readFile(file);
		file.body = contents as unknown as string[][];

		if (file.type === "image") {
			draft.application.openFiles.push(file);
			draft.application.currentFile = draft.application.openFiles.length - 1;
			return;
		}

		file.body = (file.body as unknown as string).split("\n") as any;

		if ((file.body[0] as any) === "---") {
			file.body.splice(0, 1);

			const frontmatterEndIndex = file.body.findIndex((line: any) => line === "---");
			const frontmatter = file.body.splice(0, frontmatterEndIndex);

			file.body.splice(0, 1);
			file.frontmatter = YAML.parse(frontmatter.join("\n"));

			file.body = (file.body as any).map((line: string) => line.split("").concat([" "]));
		} else {
			file.body = (file.body as any).map((line: string) => line.split("").concat([" "]));
		}

		file.selection = {
			start: { line: 0, index: 0 },
			end: { line: 0, index: 0 },
			direction: "ltr",
		};

		draft.application.openFiles.push(file);
		draft.application.currentFile = draft.application.openFiles.length - 1;
		draft.application.currentFilePath = draft.application.openFiles[draft.application.currentFile].path;

		const tree = draft.application.tree;

		if (!tree) {
			return;
		}

		transmission.emit("@application/set-focused-component", "editor");
		transmission.emit("@activity-bar/open-editor");

		context.window.setRepresentedFilename(file.path);
		context.window.setTitle(`${file.relativePath} - ${draft.application.tree.readableName} - ORDO`);
	},
	"@application/update-folder": ({ draft, payload }) => {
		const [path, increment] = payload;
		updateFolder(draft.application.tree as OrdoFolder, path, increment);
	},
	"@application/set-current-file": ({ draft, payload, transmission, context }) => {
		draft.application.currentFile = payload;
		draft.application.currentFilePath = draft.application.openFiles[payload]?.path;

		const tree = draft.application.tree;

		if (!tree) {
			return;
		}

		const file = getFile(tree, draft.application.openFiles[payload]?.path);

		if (!file) {
			context.window.setRepresentedFilename("");
			context.window.setTitle(`ORDO`);

			return;
		}

		context.window.setRepresentedFilename(file.path);
		context.window.setTitle(`${file.relativePath} - ${tree.readableName} - ORDO`);
		transmission.emit("@application/set-focused-component", "editor");
	},
	"@application/copy-path": ({ transmission, payload, context }) => {
		const tree = transmission.get((state) => state.application.tree);
		const currentFilePath = transmission.get((state) => state.application.currentFilePath);

		if (!tree) {
			return;
		}

		const file = getFile(tree, payload ? payload : currentFilePath);

		if (!file) {
			return;
		}

		context.toClipboard(file.path);
	},
	"@application/copy-relative-path": ({ transmission, payload, context }) => {
		const tree = transmission.get((state) => state.application.tree);
		const currentFilePath = transmission.get((state) => state.application.currentFilePath);

		if (!tree) {
			return;
		}

		const file = getFile(tree, payload ? payload : currentFilePath);

		if (!file) {
			return;
		}

		context.toClipboard(file.relativePath);
	},
	"@application/close-file": ({ draft, payload, context, transmission }) => {
		if (payload == null) {
			payload = draft.application.currentFile;
		}

		const currentPath = draft.application.openFiles[payload]?.path;

		if (draft.application.unsavedFiles.includes(currentPath)) {
			const response = context.dialog.showMessageBoxSync({
				type: "question",
				message: `The file "${draft.application.openFiles[payload].relativePath}" has unsaved changes. Save before closing?`,
				buttons: ["Yes", "No"],
			});

			if (response === 0) {
				transmission.emit("@application/save-file", draft.application.openFiles[payload].path);
			} else {
				draft.application.unsavedFiles.splice(draft.application.unsavedFiles.indexOf(currentPath), 1);
			}
		}

		draft.application.openFiles.splice(payload, 1);
		// TODO: Fix opening another tab when closing file
		transmission.emit("@application/set-current-file", draft.application.openFiles.length - 1);
	},
	"@application/save-file": async ({ draft, context, payload }) => {
		const file = payload
			? draft.application.openFiles.find((file) => file.path === payload)
			: draft.application.openFiles[draft.application.currentFile];

		const tree = draft.application.tree;

		if (!file || !tree) {
			return;
		}

		const treeFile = getFile(tree, file.path);

		if (!treeFile) {
			return;
		}

		await saveFile(current(file));

		const { size, mtime, atime } = await promises.stat(file.path);

		treeFile.size = file.size = size;
		treeFile.updatedAt = file.updatedAt = mtime;
		treeFile.accessedAt = file.createdAt = atime;

		draft.application.unsavedFiles = draft.application.unsavedFiles.filter((f) => f !== file.path);

		if (!draft.application.unsavedFiles.length) {
			context.window.setDocumentEdited(false);
		}
	},
});
