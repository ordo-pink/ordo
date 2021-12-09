import type { AbstractOrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

export const getFolder = <
	T extends AbstractOrdoFolder = AbstractOrdoFolder,
	K extends keyof AbstractOrdoFolder = keyof AbstractOrdoFolder,
>(
	tree: AbstractOrdoFolder,
	key: K,
	value: T[K],
): Nullable<AbstractOrdoFolder> => {
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
