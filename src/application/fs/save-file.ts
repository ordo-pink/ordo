import { promises } from "fs";

export const saveFile = (path: string, content: string): Promise<void> => promises.writeFile(path, content, "utf8");
