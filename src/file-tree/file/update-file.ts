import type { OrdoFolder, OrdoFile } from "../types";

import { produce } from "immer";
import { promises } from "fs";

import { getFile } from "./get-file";
import { isOrdoFile, isOrdoFileWithBody } from "../file-tree";

export const updateFile = (
	tree: OrdoFolder,
	path: string,
	update: (file: OrdoFile) => void,
): OrdoFolder =>
	produce(tree, (state) => {
		const file = getFile(state, "path", path);

		if (!file) {
			return null;
		}

		if (isOrdoFileWithBody(file)) {
			const body = file.body;
			update(file);

			if (body !== file.body) {
				promises.writeFile(file.path, file.body, "utf-8");
			}
		} else if (isOrdoFile(file)) {
			update(file);
		}
	});
