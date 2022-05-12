import { OrdoEventHandler } from "@core/types";
import { findOrdoFolder } from "@modules/file-explorer/utils/find-ordo-folder";

export const handleShowFileCreation: OrdoEventHandler<"@file-explorer/show-file-creation"> = async ({
	draft,
	payload,
	transmission,
}) => {
	const folder = findOrdoFolder(draft.fileExplorer.tree, payload);

	if (folder?.collapsed) {
		await transmission.emit("@file-explorer/toggle-folder", payload);
	}

	draft.fileExplorer.createFileIn = payload;
};
