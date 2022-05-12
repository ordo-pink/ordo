import { promises, existsSync } from "fs";
import { sep } from "path";

import { createFolder } from "@modules/file-explorer/api/create-folder";

export const createFile = async (path: string): Promise<void> => {
	if (existsSync(path)) {
		return;
	}

	const parentPath = path.split(sep).slice(0, -1).join(sep);

	if (!existsSync(parentPath)) {
		await createFolder(parentPath);
	}

	await promises.writeFile(path, "", "utf-8");
};
