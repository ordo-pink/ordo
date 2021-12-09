import type { AbstractOrdoFile, AbstractOrdoFolder, OrdoFile, OrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

import { getFolder } from "../folder/get-folder";

export const getParent = <T extends AbstractOrdoFile | AbstractOrdoFolder>(
	tree: AbstractOrdoFolder,
	node: T,
): Nullable<T extends OrdoFile | OrdoFolder ? OrdoFolder : AbstractOrdoFolder> => {
	const parentPath = node.path.slice(0, node.path.lastIndexOf("/"));

	return getFolder(tree, "path", parentPath) as any;
};
