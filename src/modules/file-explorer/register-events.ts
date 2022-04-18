import { registerEvents } from "@core/transmission/register-ordo-events";
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
	"@file-explorer/show-file-creation": ({ draft, payload }) => {
		draft.fileExplorer.createFileIn = payload;
	},
	"@file-explorer/show-folder-creation": ({ draft, payload }) => {
		draft.fileExplorer.createFolderIn = payload;
	},
});
