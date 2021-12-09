import type { OrdoEntity, OrdoFolder } from "../types";
import type { Nullable } from "../../common/types";

import { getFolder } from "../folder/get-folder";

export const getParent = (tree: OrdoFolder, node: OrdoEntity): Nullable<OrdoFolder> => {
	const parentPath = node.path.slice(0, node.path.lastIndexOf("/"));

	return getFolder(tree, "path", parentPath);
};
