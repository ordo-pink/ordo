import { OrdoEventHandler } from "@core/types";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";

export const handleShowFolderCreation: OrdoEventHandler<"@file-explorer/show-folder-creation"> = async ({
	draft,
	payload,
	transmission,
}) => {
	const folder = findOrdoFolder(draft.fileExplorer.tree, payload);

	if (folder?.collapsed) {
		await transmission.emit("@file-explorer/toggle-folder", payload);
	}

	draft.fileExplorer.createFolderIn = payload;
};
