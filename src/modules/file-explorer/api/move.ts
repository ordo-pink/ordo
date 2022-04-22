import { promises } from "fs";

export const move = (oldPath: string, newPath: string) => {
	return promises.rename(oldPath, newPath);
};
