import { join } from "path";

import { OrdoEventHandler } from "@core/types";
import { createFolder } from "@modules/file-explorer/api/create-folder";

export const handleCreateFolder: OrdoEventHandler<"@file-explorer/create-folder"> = async ({
	transmission,
	payload,
}) => {
	const { createFolderIn, tree } = transmission.select((state) => state.fileExplorer);
	const path = join(createFolderIn, payload);

	await createFolder(path);

	await transmission.emit("@file-explorer/hide-creation", null);
	await transmission.emit("@file-explorer/list-folder", tree.path);
};
