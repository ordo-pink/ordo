import { promises } from "fs";

export const saveFile = (path: string, content: string): Promise<void> => {
	return promises.writeFile(path, content, "utf-8");
};
