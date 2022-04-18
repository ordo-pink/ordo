import { OrdoFolder } from "@modules/file-explorer/types";

export const getFolderOrParent = (tree: OrdoFolder, path: string): OrdoFolder | null => {
	if (tree.path === path) {
		return tree;
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			const found = getFolderOrParent(child as OrdoFolder, path);

			if (found) {
				return found;
			}
		} else {
			if (child.path === path) {
				return tree;
			}
		}
	}

	return null;
};
