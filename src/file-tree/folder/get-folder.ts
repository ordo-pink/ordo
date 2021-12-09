import type { OrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

export const getFolder = <K extends keyof OrdoFolder = keyof OrdoFolder>(
	tree: OrdoFolder,
	key: K,
	value: OrdoFolder[K],
): Nullable<OrdoFolder> => {
	if (tree[key] === value) {
		return tree;
	}

	for (const child of tree.children) {
		if (child.type == "folder") {
			if (child[key] === value) {
				return child;
			}

			const found = getFolder(child, key, value);

			if (found) {
				return found;
			}
		}
	}

	return null;
};
