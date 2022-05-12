import { OrdoEventHandler } from "@core/types";
import { updateFolder } from "../api/update-folder";
import { findOrdoFolder } from "../utils/find-ordo-folder";

export const handleSetFolderColor: OrdoEventHandler<"@file-explorer/set-folder-color"> = ({ draft, payload }) => {
	const folder = findOrdoFolder(draft.fileExplorer.tree, payload.path);

	if (!folder) {
		return;
	}

	folder.color = payload.color;

	updateFolder(payload.path, { color: payload.color });
};
