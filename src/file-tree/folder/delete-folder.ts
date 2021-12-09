import type { OrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

import { produce } from "immer";

import { getParent } from "../common/get-parent";
import { getFolder } from "./get-folder";

export const deleteFolder = (tree: OrdoFolder, path: string): Nullable<OrdoFolder> =>
	produce(tree, (state) => {
		const folder = getFolder(state, "path", path);
		const parent = getParent(state, folder);

		if (!folder) {
			return null;
		}

		parent.children.splice(parent.children.indexOf(folder), 1);
	});
