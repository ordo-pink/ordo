import { OrdoFolder } from "@modules/editor/editor-slice";

export const getParent = (tree: OrdoFolder, path: string): OrdoFolder | null => {
	for (const child of tree.children) {
		if (child.path === path) {
			return tree;
		}

		if (child.type === "folder") {
			const found = getParent(child as OrdoFolder, path);

			if (found) {
				return found;
			}
		}
	}

	return null;
};
