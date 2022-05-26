import { OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "./is-folder";

export const findOrdoFolder = <T extends OrdoFolder, K extends keyof T>(
	tree: T,
	key: K,
	value: T[K],
): OrdoFolder | null => {
	if (tree[key] === value) {
		return tree;
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			if ((child as T)[key] === value) {
				return child as OrdoFolder;
			}

			const found = findOrdoFolder(child as T, key, value);

			if (found) {
				return found;
			}
		}
	}

	return null;
};

export const findOrdoFolderByPath = (tree: OrdoFolder, path: string): OrdoFolder | null => {
	return findOrdoFolder(tree, "path", path);
};
