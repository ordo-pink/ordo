import { Colors } from "@core/appearance/colors";
import { registerEvents } from "@core/transmission/register-ordo-events";
import { Menu, MenuItem } from "electron";
import { createFile } from "./api/create-file";
import { createFolder } from "./api/create-folder";
import { listFolder } from "./api/list-folder";
import { updateFolder } from "./api/update-folder";
import { FileExplorerEvents } from "./types";
import { findOrdoFile } from "./utils/find-ordo-file";
import { findOrdoFolder } from "./utils/find-ordo-folder";

export default registerEvents<FileExplorerEvents>({
	"@file-explorer/list-folder": async ({ draft, payload }) => {
		draft.fileExplorer.tree = await listFolder(payload);
	},
	"@file-explorer/toggle-folder": async ({ draft, payload }) => {
		const folder = findOrdoFolder(draft.fileExplorer.tree, payload);

		if (!folder) {
			return;
		}

		folder.collapsed = !folder.collapsed;

		updateFolder(payload, { collapsed: folder.collapsed });
	},
	"@file-explorer/create-file": async ({ draft, transmission, payload }) => {
		const { createFileIn } = transmission.select((state) => state.fileExplorer);

		draft.fileExplorer.tree = await createFile(draft.fileExplorer.tree, createFileIn, payload);

		transmission.emit("@file-explorer/hide-creation", null);
	},
	"@file-explorer/create-folder": async ({ draft, transmission, payload }) => {
		const { createFolderIn } = transmission.select((state) => state.fileExplorer);

		draft.fileExplorer.tree = await createFolder(draft.fileExplorer.tree, createFolderIn, payload);

		transmission.emit("@file-explorer/hide-creation", null);
	},
	"@file-explorer/remove-file": async ({ draft, payload, context, transmission }) => {
		const currentPath = transmission.select((state) => state.editor.currentTab);
		const tree = transmission.select((state) => state.fileExplorer.tree);
		const path = payload ? payload : currentPath;

		const isOpen = !payload || payload === currentPath;

		const response = context.dialog.showMessageBoxSync({
			type: "question",
			buttons: ["Yes", "No"],
			message: `Are you sure you want to remove "${path}"?`,
		});

		if (response === 0) {
			if (isOpen) {
				await transmission.emit("@editor/close-tab", path);
			}

			await context.trashItem(path);

			draft.fileExplorer.tree = await listFolder(tree.path);
		}
	},
	"@file-explorer/remove-folder": async ({ draft, payload, context, transmission }) => {
		const tree = transmission.select((state) => state.fileExplorer.tree);

		const response = context.dialog.showMessageBoxSync({
			type: "question",
			buttons: ["Yes", "No"],
			message: `Are you sure you want to remove folder "${payload}"?`,
		});

		if (response === 0) {
			await context.trashItem(payload);

			draft.fileExplorer.tree = await listFolder(tree.path);
		}
	},
	"@file-explorer/hide-creation": ({ draft }) => {
		draft.fileExplorer.createFileIn = "";
		draft.fileExplorer.createFolderIn = "";
	},
	"@file-explorer/show-file-creation": async ({ draft, payload, transmission }) => {
		const folder = findOrdoFolder(draft.fileExplorer.tree, payload);

		if (folder?.collapsed) {
			await transmission.emit("@file-explorer/toggle-folder", payload);
		}

		draft.fileExplorer.createFileIn = payload;
	},
	"@file-explorer/show-folder-creation": async ({ draft, payload, transmission }) => {
		const folder = findOrdoFolder(draft.fileExplorer.tree, payload);

		if (folder?.collapsed) {
			await transmission.emit("@file-explorer/toggle-folder", payload);
		}

		draft.fileExplorer.createFolderIn = payload;
	},
	"@file-explorer/show-folder-context-menu": ({ payload: { x, y, path }, transmission, context }) => {
		const tree = transmission.select((state) => state.fileExplorer.tree);
		const folder = findOrdoFolder(tree, path);

		if (!folder) {
			return;
		}

		const menu = new Menu();

		menu.append(
			new MenuItem({
				label: "New File",
				accelerator: "CommandOrControl+N",
				click: () => transmission.emit("@file-explorer/show-file-creation", path),
			}),
		);

		menu.append(
			new MenuItem({
				label: "New Folder",
				click: () => transmission.emit("@file-explorer/show-folder-creation", path),
			}),
		);

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Reveal in Finder",
				accelerator: "CommandOrControl+Alt+R",
				click: () => transmission.emit("@file-explorer/reveal-in-finder", path),
			}),
		);

		menu.append(new MenuItem({ type: "separator" }));

		const colorOptions = Colors.slice(17).map(
			(color) =>
				new MenuItem({
					label: color[0].toUpperCase() + color.slice(1),
					type: "radio",
					checked: folder.color === color,
					click: () => transmission.emit("@file-explorer/set-folder-color", { path, color }),
				}),
		);

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Color",
				submenu: colorOptions as unknown as Menu,
			}),
		);

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Copy Path",
				accelerator: "CommandOrControl+Option+C",
				click: () => transmission.emit("@file-explorer/copy-path", path),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Remove Folder",
				accelerator: "CommandOrControl+Backspace",
				click: () => transmission.emit("@file-explorer/remove-folder", path),
			}),
		);

		menu.popup({
			window: context.window,
			x,
			y,
		});
	},
	"@file-explorer/show-file-context-menu": ({ payload: { x, y, path }, transmission, context }) => {
		const tree = transmission.select((state) => state.fileExplorer.tree);
		const file = findOrdoFile(tree, "path", path);

		if (!file) {
			return;
		}

		const menu = new Menu();

		menu.append(
			new MenuItem({
				label: "Reveal in Finder",
				accelerator: "CommandOrControl+Alt+R",
				click: () => transmission.emit("@file-explorer/reveal-in-finder", path),
			}),
		);

		menu.append(new MenuItem({ type: "separator" }));

		menu.append(
			new MenuItem({
				label: "Copy Path",
				accelerator: "CommandOrControl+Option+C",
				click: () => transmission.emit("@file-explorer/copy-path", path),
			}),
		);

		menu.append(
			new MenuItem({
				label: "Remove File",
				accelerator: "CommandOrControl+Backspace",
				click: () => transmission.emit("@file-explorer/remove-file", path),
			}),
		);

		menu.popup({
			window: context.window,
			x,
			y,
		});
	},
	"@file-explorer/reveal-in-finder": ({ payload, context, transmission }) => {
		const currentTab = transmission.select((state) => state.editor.currentTab);

		context.showInFolder(payload ? payload : currentTab);
	},
	"@file-explorer/copy-path": ({ transmission, payload, context }) => {
		const currentTab = transmission.select((state) => state.editor.currentTab);

		context.toClipboard(payload ? payload : currentTab);
	},
	"@file-explorer/set-folder-color": ({ draft, payload }) => {
		const folder = findOrdoFolder(draft.fileExplorer.tree, payload.path);

		if (!folder) {
			return;
		}

		folder.color = payload.color;

		updateFolder(payload.path, { color: payload.color });
	},
});
