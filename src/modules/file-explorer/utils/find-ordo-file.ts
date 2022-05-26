import { OrdoFile, OrdoFolder } from "@modules/file-explorer/types";

export const findOrdoFile = <Key extends keyof OrdoFile = "path">(
	tree: OrdoFolder,
	key: Key,
	value: OrdoFile[Key],
): OrdoFile | null => {
	if (key === "path" && tree.path === value) {
		return null;
	}

	for (const child of tree.children) {
		if (child.type === "folder") {
			const found = findOrdoFile(child as OrdoFolder, key, value);

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
