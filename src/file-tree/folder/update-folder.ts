import type { AbstractOrdoFolder } from "../types";

import { produce } from "immer";

import { getFolder } from "./get-folder";

export const updateFolder = (
	tree: AbstractOrdoFolder,
	path: string,
	update: (folder: AbstractOrdoFolder) => void,
): AbstractOrdoFolder =>
	produce(tree, (state) => {
		const folder = getFolder(state, "path", path);

		if (!folder) {
			return null;
		}

		update(folder);
	});
