import { join } from "path";
import { existsSync, promises } from "fs";

import { OrdoEventHandler } from "@core/types";

export const handleCreateFolder: OrdoEventHandler<"@file-explorer/create-folder"> = async ({
	transmission,
	payload,
}) => {
	const { createFolderIn, tree } = transmission.select((state) => state.fileExplorer);
	const path = join(createFolderIn, payload);

	if (existsSync(path)) {
		return;
	}

	await promises.mkdir(path, { recursive: true });

	await transmission.emit("@file-explorer/hide-creation", null);
	await transmission.emit("@file-explorer/list-folder", tree.path);
};
