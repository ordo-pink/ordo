import { OrdoFolder } from "@modules/file-explorer/types";

export const findOrdoFolder = (tree: OrdoFolder, path: string): OrdoFolder | null => {
	if (tree.path === path) {
		return tree;
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			if (child.path === path) {
				return child as OrdoFolder;
			}

			const found = findOrdoFolder(child as OrdoFolder, path);

			if (found) {
				return found;
			}
		}
	}

	return null;
};
