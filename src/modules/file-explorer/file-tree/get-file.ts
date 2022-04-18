import { OrdoFolder, OrdoFile } from "@modules/editor/editor-slice";

export const getFile = (tree: OrdoFolder, path: string): OrdoFile | null => {
	if (tree.path === path) {
		return null;
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			const found = getFile(child as OrdoFolder, path);

			if (found) {
				return found;
			}
		} else {
			if (child.path === path) {
				return child as OrdoFile;
			}
		}
	}

	return null;
};
