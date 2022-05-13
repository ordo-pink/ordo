import { promises } from "fs";
import { join } from "path";

import { OrdoEventHandler } from "@core/types";

/**
 * Moves file or folder from oldPath to newPath.
 */
export const handleMove: OrdoEventHandler<"@file-explorer/move"> = async ({ payload, transmission, context }) => {
	const { oldPath, name, newFolder } = payload;
	const tree = transmission.select((state) => state.fileExplorer.tree);

	const newPath = join(newFolder, name);

	if (oldPath === newPath) {
		return;
	}

	const result = context.dialog.showMessageBoxSync(context.window, {
		type: "question",
		buttons: ["Yes", "No"],
		message: `Are you sure you want to move "${name}" to "${newFolder}"?`,
	});

	if (result === 0) {
		await promises.rename(oldPath, newPath);
		await transmission.emit("@file-explorer/list-folder", tree.path);
	}
};
