import type { OrdoFolder } from "../types";

import { produce } from "immer";

import { getFolder } from "./get-folder";

export const updateFolder = (
	tree: OrdoFolder,
	path: string,
	update: (folder: OrdoFolder) => void,
): OrdoFolder =>
	produce(tree, (state) => {
		const folder = getFolder(state, "path", path);

		if (!folder) {
			return null;
		}

		update(folder);
	});
