import { promises } from "fs";

export const readFile = (path: string) => promises.readFile(path, "utf-8");
