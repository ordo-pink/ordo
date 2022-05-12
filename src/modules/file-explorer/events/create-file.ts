import { join } from "path";

import { OrdoEventHandler } from "@core/types";
import { createFile } from "@modules/file-explorer/api/create-file";

export const handleCreateFile: OrdoEventHandler<"@file-explorer/create-file"> = async ({ transmission, payload }) => {
	const { createFileIn, tree } = transmission.select((state) => state.fileExplorer);
	const path = join(createFileIn, payload);

	await createFile(path);

	await transmission.emit("@file-explorer/hide-creation", null);
	await transmission.emit("@file-explorer/list-folder", tree.path);
	await transmission.emit("@editor/open-tab", path);
};
