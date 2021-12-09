import type { OrdoFile, OrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

export const getFile = <K extends keyof OrdoFile = keyof OrdoFile>(
	tree: OrdoFolder,
	key: K,
	value: OrdoFile[K],
): Nullable<OrdoFile> => {
	for (const child of tree.children) {
		if (child.type != "folder") {
			if (child[key] === value) {
				return child;
			}
		} else {
			const found = getFile(child, key, value);

			if (found) {
				return found;
			}
		}
	}

	return null;
};
