import { join, sep } from "path";
import { existsSync, promises } from "fs";

import { OrdoEventHandler } from "@core/types";

export const handleCreateFile: OrdoEventHandler<"@file-explorer/create-file"> = async ({ transmission, payload }) => {
	const { createFileIn, tree } = transmission.select((state) => state.fileExplorer);

	const path = join(createFileIn, payload);

	if (existsSync(path)) {
		return;
	}

	const parentPath = path.split(sep).slice(0, -1).join(sep);

	if (!existsSync(parentPath)) {
		await transmission.emit("@file-explorer/create-folder", parentPath);
	}

	await promises.writeFile(path, "", "utf-8");

	await transmission.emit("@file-explorer/hide-creation", null);
	await transmission.emit("@file-explorer/list-folder", tree.path);
	await transmission.emit("@editor/open-tab", path);
};
