import type { OrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

import { produce } from "immer";

import { getParent } from "../common/get-parent";
import { getFile } from "./get-file";

export const deleteFile = (tree: OrdoFolder, path: string): Nullable<OrdoFolder> =>
	produce(tree, (state) => {
		const file = getFile(state, "path", path);
		const parent = getParent(state, file);

		if (!file) {
			return null;
		}

		parent.children.splice(parent.children.indexOf(file), 1);
	});
