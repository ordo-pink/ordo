import { registerEvents } from "@core/transmission/register-ordo-events";
import { Menu, MenuItem } from "electron";
import { createFile } from "./api/create-file";
import { createFolder } from "./api/create-folder";
import { listFolder } from "./api/list-folder";
import { updateFolder } from "./api/update-folder";
import { FileExplorerEvents } from "./types";
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

		menu.popup({
			window: context.window,
			x,
			y,
		});
	},
	"@file-explorer/show-file-context-menu": () => {},
});
