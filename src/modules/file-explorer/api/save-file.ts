import { promises } from "fs";

export const saveFile = (path: string, content: string) => {
	return promises.writeFile(path, content, "utf-8");
};
