import { OrdoFile, OrdoFolder } from "@modules/editor/editor-slice";

export const findOrdoFileBy = <Key extends keyof OrdoFile = "path">(
	tree: OrdoFolder,
	key: Key,
	value: OrdoFile[Key],
): OrdoFile | null => {
	if (key === "path" && tree.path === value) {
		throw new Error(`"${value}" is a folder, not a file`);
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			const found = findOrdoFileBy(child as OrdoFolder, key, value);

			if (found) {
				return found;
			}
		} else {
			if (child[key] === value) {
				return child as OrdoFile;
			}
		}
	}

	return null;
};
