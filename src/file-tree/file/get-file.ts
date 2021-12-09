import type { AbstractOrdoFile, AbstractOrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

export const getFile = <
	T extends AbstractOrdoFile = AbstractOrdoFile,
	K extends keyof AbstractOrdoFile = keyof AbstractOrdoFile,
>(
	tree: AbstractOrdoFolder,
	key: K,
	value: T[K],
): Nullable<AbstractOrdoFile> => {
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
