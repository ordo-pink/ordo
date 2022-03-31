import { OrdoFile, OrdoFolder } from "@modules/editor/editor-slice";

export const findOrdoFile = (tree: OrdoFolder, path: string): OrdoFile | null => {
	if (tree.path === path) {
		throw new Error(`"${path}" is a folder, not a file`);
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			const found = findOrdoFile(child as OrdoFolder, path);

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
