import type { OrdoFile, OrdoFileWithBody } from "../types";

import { promises } from "fs";

export const getFileWithBody = async (file: OrdoFile): Promise<OrdoFileWithBody> => {
	const body = await promises.readFile(file.path, "utf-8");

	return {
		...file,
		body,
	};
};
