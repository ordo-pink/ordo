import { OrdoEventHandler } from "@core/types";
import { findOrdoFolderByPath } from "@modules/file-explorer/utils/find-ordo-folder";

/**
 * Shows input for creating a file.
 */
export const handleShowFileCreation: OrdoEventHandler<"@file-explorer/show-file-creation"> = async ({
	draft,
	payload,
	transmission,
}) => {
	const folder = findOrdoFolderByPath(draft.fileExplorer.tree, payload);

	if (folder?.collapsed) {
		await transmission.emit("@file-explorer/toggle-folder", payload);
	}

	draft.fileExplorer.createFileIn = payload;
};
