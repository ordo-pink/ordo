import { promises, existsSync } from "fs";

export const createFolder = async (path: string): Promise<void> => {
	if (existsSync(path)) {
		return;
	}

	await promises.mkdir(path, { recursive: true });
};
